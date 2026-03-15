export function initFiltering(elements) {
  // Функция для наполнения селекторов (Sellers) данными с сервера
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        // Очищаем старые опции, кроме первой ("Все")
        elements[elementName].innerHTML = '<option value="">All</option>';

        elements[elementName].append(
          ...Object.values(indexes[elementName]).map((name) => {
            const el = document.createElement("option");
            el.textContent = name;
            el.value = name;
            return el;
          }),
        );
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    // 1. ИСПРАВЛЕНИЕ: Проверяем нажатие на "крестик" по атрибуту name="clear"
    if (action && action.name === "clear") {
      const parent = action.parentElement;
      
      // Находим ВСЕ инпуты внутри обертки фильтра (это очистит и Date, и оба поля Total)
      const inputs = parent.querySelectorAll('input, select');
      
      inputs.forEach(input => {
        input.value = ''; // Очищаем визуально в DOM
        if (state) {
          state[input.name] = ''; // Очищаем в объекте состояния (state)
        }
      });
    }

    // 2. ИСПРАВЛЕНИЕ: Логика для кнопки "Reset all filters" (когда action не передан)
    // Чтобы при общем сбросе state тоже очищался
    if (!action && state) {
      Object.keys(state).forEach(key => {
          if (['date', 'customer', 'seller', 'totalFrom', 'totalTo'].includes(key)) {
              state[key] = '';
          }
      });
    }

    // Формируем объект фильтра для сервера
    const filter = {};
    Object.keys(elements).forEach((key) => {
      const element = elements[key];
      if (element) {
        // Если это инпут или селект и в нем есть значение
        if (["INPUT", "SELECT"].includes(element.tagName) && element.value) {
          // Сервер ждет ключи вида filter[seller] или filter[date]
          filter[`filter[${element.name}]`] = element.value;
        }
      }
    });

    // Если есть активные фильтры, подмешиваем их в query
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}