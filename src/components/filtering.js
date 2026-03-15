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
    // Код с обработкой очистки поля (кнопка clear)
    if (action?.dataset?.name === "clear") {
      const fieldName = action.dataset.field;
      const parent = action.parentElement;
      const input =
        parent.querySelector("input") || parent.querySelector("select");
      if (input) {
        input.value = "";
        state[fieldName] = "";
      }
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
