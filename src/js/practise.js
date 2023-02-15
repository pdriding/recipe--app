const ingredients = Object.entries(newRecipe)
  .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
  .map(ing => {
    const ingArr = ing[1].split(',').map(el => el.trim());
    // const ingArr = ing[1].replaceAll(' ', '').split(',');
    if (ingArr.length !== 3)
      throw new Error(
        'Wrong ingredient format! Please use the correct format :)'
      );

    const [quantity, unit, description] = ingArr;
    console.log(ingArr);

    return { quantity: quantity ? +quantity : null, unit, description };
  });
