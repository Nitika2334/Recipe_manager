document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipe-list');
    const searchInput = document.getElementById('search-input');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editName = document.getElementById('edit-name');
    const editDescription = document.getElementById('edit-description');
    const editRecipeIndex = document.getElementById('edit-recipe-index');
    const editButton = document.getElementById('edit-button');
    const searchButton = document.getElementById('search-button');
    const closeModalDiv = document.getElementById("close-modal");

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    closeModalDiv.addEventListener("click", closeModal);




    function updateRecipeList(recipes) {
        recipeList.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const li = document.createElement('li');
            const heading = document.createElement('h3'); // Use an h3 element for the recipe name
            heading.textContent = recipe.name;
            li.appendChild(heading);

            // Split the recipe description into lines
            const recipeDescriptionLines = recipe.description.split('\n');
            const descriptionList = document.createElement('ul');

            // Create bullet points for each line in the description
            recipeDescriptionLines.forEach(line => {
                const descriptionItem = document.createElement('li');
                descriptionItem.textContent = line;
                descriptionList.appendChild(descriptionItem);
            });

            li.appendChild(descriptionList);
            li.innerHTML += `<button onclick="editRecipe(${index})">Edit</button>
                <button onclick="deleteRecipe(${index})">Delete</button>`;
            recipeList.appendChild(li);
        });
    }



    function closeModal() {
        editModal.style.display = 'none';
    }

    function searchRecipes(query) {
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase())
        );
        updateRecipeList(filteredRecipes);
    }

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipeName = document.getElementById('recipe-name').value;
        const recipeDescription = document.getElementById('recipe-description').value;

        if (!recipeName || !recipeDescription) {
            alert('Please fill in both fields.');
            return;
        }

        const newRecipe = {
            name: recipeName,
            description: recipeDescription,
        };

        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipeForm.reset();
        updateRecipeList(recipes);
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = editRecipeIndex.value;
        recipes[index].name = editName.value;
        recipes[index].description = editDescription.value;
        localStorage.setItem('recipes', JSON.stringify(recipes));
        closeModal();
        updateRecipeList(recipes);
    });

    window.deleteRecipe = (index) => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            recipes.splice(index, 1);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            updateRecipeList(recipes);
        }
    };

    window.editRecipe = (index) => {
        const recipeToEdit = recipes[index];
        editName.value = recipeToEdit.name;
        editDescription.value = recipeToEdit.description;
        editRecipeIndex.value = index;
        editModal.style.display = 'block';
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        searchRecipes(query);
    });

    // Adding event listeners for the "Edit" and "Search" buttons
    // editButton.addEventListener('click', () => {
    //     const index = editRecipeIndex.value;
    //     editRecipe(index);
    // });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        searchRecipes(query);
    });

    updateRecipeList(recipes);
});