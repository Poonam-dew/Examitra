import React, { useState } from "react";
import { useEffect } from "react";
import { Search } from "lucide-react";
import { Plus, Pencil, Trash2, GripVertical, ChevronUp } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import Modal from "../Components/Modal";
import DeleteModal from "../Components/DeleteModal";

function Tags() {
//    const [tagCategories, setTagCategories] = useState([
//   {
//     id: 1,
//     title: "Exam Name",
//     tags: [
//       "UPSC CSE",
//       "SSC CGL",
//       "SSC CHSL",
//       "IBPS PO",
//       "SBI PO",
//       "RRB NTPC",
//       "GATE",
//       "State PSC",
//       "CDS",
//       "NDA",
//       "AFCAT"
//     ]
//   },
//   {
//     id: 2,
//     title: "Exam Year",
//     tags: ["2025", "2026", "June Cycle", "October Cycle"]
//   },
//   {
//     id: 3,
//     title: "Job Grade",
//     tags: ["A", "B", "C", "D"]
//   },
//   {
//     id: 4,
//     title: "Preparation Stage",
//     tags: [
//       "Foundation",
//       "Prelims",
//       "Mains",
//       "Interview",
//       "Revision"
//     ]
//   }
// ]);
const [tagCategories, setTagCategories] = useState([]);


const showToast = (message, icon = "✓") => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md
                  bg-white border text-black
                  ${t.visible ? "animate-slide-in" : "animate-slide-out"}`}
    >
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-6 h-6 bg-black rounded-full">
        <span className="text-white text-sm font-bold">{icon}</span>
      </div>

      {/* Text */}
      <p className="text-[13px] font-semibold tracking-wide">{message}</p>
    </div>
  ), {
    duration: 2200,
  });
};
useEffect(() => {
  fetch("https://category-tag-api.onrender.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
     setTagCategories(
  data.map((cat) => ({
    id: cat._id,
    title: cat.name || "",
    tags: (cat.tags || []).map(t => ({
      id: t._id,
      value: t.value
    }))
  }))
);

    })
    .catch(() => showToast("Failed to load categories", "!"));
}, []);

const [searchQuery, setSearchQuery] = useState("");



 const [openModal, setOpenModal] = useState(false);
const [newCategory, setNewCategory] = useState("");
// const [showToast, setShowToast] = useState(false);

const [modalType, setModalType] = useState("");
const [activeCategoryId, setActiveCategoryId] = useState(null);


const [newTag, setNewTag] = useState("");
const [editingCategoryId, setEditingCategoryId] = useState(null);
const [collapsedCategories, setCollapsedCategories] = useState({});
const [deleteCategoryId, setDeleteCategoryId] = useState(null);
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [editingTag, setEditingTag] = useState(null); 
// { categoryId, tagId }

const [deleteTagInfo, setDeleteTagInfo] = useState(null);
// { categoryId, tagId }

const [selectedTags, setSelectedTags] = useState({});


const handleDragEnd = (result) => {
  if (!result.destination) return;

  const reordered = Array.from(tagCategories); // <-- use tagCategories
  const [moved] = reordered.splice(result.source.index, 1);
  reordered.splice(result.destination.index, 0, moved);

  setTagCategories(reordered); // <-- update tagCategories
};


const handleAddCategory = async () => {
  if (!newCategory.trim()) {
    showToast("Category name is required", "!");
    return;
  }

  try {
    if (editingCategoryId) {
      // Update existing category
      const res = await fetch(
        `https://category-tag-api.onrender.com/api/categories/${editingCategoryId}`,
        {
          method: "PUT", // make sure backend supports PUT
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        }
      );
      const updated = await res.json();

      setTagCategories(tagCategories.map(cat =>
        cat.id === editingCategoryId ? { ...cat, title: updated.name } : cat
      ));
      showToast("Category updated successfully", "✔");
    } else {
      // Add new category
      const res = await fetch(
        "https://category-tag-api.onrender.com/api/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        }
      );
      const created = await res.json();

      setTagCategories([...tagCategories, { id: created._id, title: created.name, tags: [] }]);
      showToast("Category added successfully", "✔");
    }

    setOpenModal(false);
    setNewCategory("");
    setEditingCategoryId(null);

  } catch (error) {
    showToast("Failed to save category", "!");
  }
};


const handleAddOrEditTag = async () => {
  if (!newTag.trim()) {
    showToast("Tag value is required", "!");
    return;
  }

  try {
if (editingTag) {
  const res = await fetch(
    `https://category-tag-api.onrender.com/api/categories/${editingTag.categoryId}/tags/${editingTag.tagId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newTag,
        value: newTag,
      }),
    }
  );

  const data = await res.json();

  // ✅ handle both backend response styles
  const updatedTag = data.tags
    ? data.tags.find((t) => t._id === editingTag.tagId)
    : data;

 setTagCategories((prev) =>
  prev.map((cat) =>
    cat.id === editingTag.categoryId
      ? {
          ...cat,
          tags: cat.tags.map((t) =>
            t.id === editingTag.tagId
              ? { ...t, value: newTag } // 🔥 use newTag directly
              : t
          ),
        }
      : cat
  )
);


  showToast("Tag updated successfully", "✔");
}

 else {
  // ADD TAG
  const res = await fetch(
    `https://category-tag-api.onrender.com/api/categories/${activeCategoryId}/tags`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newTag,
        value: newTag,
      }),
    }
  );

  const updatedCategory = await res.json();

  // extract last added tag
  const lastTag =
    updatedCategory.tags[updatedCategory.tags.length - 1];

  setTagCategories(prev =>
    prev.map(cat =>
      cat.id === activeCategoryId
        ? {
            ...cat,
            tags: [
              ...cat.tags,
              {
                id: lastTag._id,
                value: lastTag.value,
              },
            ],
          }
        : cat
    )
  );

  showToast("Tag added successfully", "✔");
}

    setOpenModal(false);
    setNewTag("");
    setEditingTag(null);
  } catch {
    showToast("Failed to save tag", "!");
  }
};


const handleEditCategory = (category) => {
  setModalType("category");
  setNewCategory(category.title); // pre-fill input
  setEditingCategoryId(category.id); // remember which category is being edited
  setOpenModal(true); // open modal
};


const toggleCategoryCollapse = (categoryId) => {
  setCollapsedCategories(prev => ({
    ...prev,
    [categoryId]: !prev[categoryId] // toggle true/false
  }));
};

const handleDeleteCategory = async () => {
  try {
    await fetch(
      `https://category-tag-api.onrender.com/api/categories/${deleteCategoryId}`,
      { method: "DELETE" }
    );

    setTagCategories(prev =>
      prev.filter(cat => cat.id !== deleteCategoryId)
    );

    showToast("Category deleted successfully", "✓");
  } catch (error) {
    showToast("Failed to delete category", "!");
    throw new Error("Delete failed"); // ⬅️ required for modal loading logic
  }
};


const filteredTags = tagCategories.filter((category) => {
  const query = searchQuery.toLowerCase();

  // match category title
  const categoryMatch = category.title.toLowerCase().includes(query);

  // match any tag value
  const tagMatch = category.tags.some((tag) =>
    tag.value.toLowerCase().includes(query)
  );

  return categoryMatch || tagMatch;
});

 
const handleDeleteTag = async () => {
  try {
    await fetch(
      `https://category-tag-api.onrender.com/api/categories/${deleteTagInfo.categoryId}/tags/${deleteTagInfo.tagId}`,
      { method: "DELETE" }
    );

    setTagCategories(prev =>
      prev.map(cat =>
        cat.id === deleteTagInfo.categoryId
          ? {
              ...cat,
              tags: cat.tags.filter(t => t.id !== deleteTagInfo.tagId),
            }
          : cat
      )
    );

    showToast("Tag deleted successfully", "✓");
  } catch {
    showToast("Failed to delete tag", "!");
    throw new Error("Delete failed"); // ⬅️ important
  }
};


const handleTagSelect = (categoryName, tagValue) => {
  setSelectedTags((prev) => {
    const existing = prev[categoryName] || [];

    const updated = existing.includes(tagValue)
      ? existing.filter((t) => t !== tagValue)
      : [...existing, tagValue];

    if (updated.length === 0) {
      const copy = { ...prev };
      delete copy[categoryName];
      return copy;
    }

    return {
      ...prev,
      [categoryName]: updated,
    };
  });
};


  

  return (
   <div className="min-h-screen p-6 bg-indigo-100 space-y-6">
    

      {/* Heading */}
     <div className=" p-4  flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Tag Management</h1>
    <p className="text-gray-500 text-base mt-1">
      Manage tag categories and values for Examitra Ads
    </p>
  </div>
{openModal && (
 <Modal
  title={
    modalType === "tag"
      ? editingTag
        ? "Edit Tag"
        : "Add New Tag"
      : editingCategoryId
      ? "Edit Category"
      : "Add New Category"
  }
  label={modalType === "tag" ? "Tag Value" : "Category Name"}
  placeholder={
    modalType === "tag"
      ? "Enter tag value"
      : "Enter category name"
  }
  value={modalType === "category" ? newCategory : newTag}
  setValue={modalType === "category" ? setNewCategory : setNewTag}
  onSubmit={modalType === "category" ? handleAddCategory : handleAddOrEditTag}
  onClose={() => {
    setOpenModal(false);
    setEditingCategoryId(null);
    setEditingTag(null);
  }}
  buttonText={
    modalType === "tag"
      ? editingTag
        ? "Update"
        : "Add"
      : editingCategoryId
      ? "Update"
      : "Add"
  }
/>

)}




<button
  className="bg-black font-semibold text-white px-5 py-3 rounded-lg shadow text-sm"
  onClick={() => {
    setModalType("category");
    setNewCategory("");
    setOpenModal(true);
  }}
>
  + Add Category
</button>



</div>


      {/* Search  */}
      <div className="relative w-full ">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-5 text-muted-foreground" />
      
      {/* Input Field */}
     <input
  type="text"
  placeholder="Search tags across all categories..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="flex h-10 w-full rounded-md border border-input bg-background px-10 
             py-2 text-base text-foreground placeholder:text-muted-foreground 
             focus:outline-none focus:ring-black focus:ring-2 "
/>

    </div>
    {Object.keys(selectedTags).length > 0 && (
  <div className="bg-gray-200 bg-opacity-30 border border-black rounded-xl p-6">
    <div className="flex p-1 justify-between items-center mb-2">
      <h3 className="font-semibold text-lg">Selected Tags Summary</h3>
      <button
        className="text-sm font-medium"
        onClick={() => setSelectedTags({})}
      >
        Clear All
      </button>
    </div>

    {Object.entries(selectedTags).map(([categoryName, tags]) => (
      <div key={categoryName} className="mb-2 p-1">
        <p className="text-sm font-medium mb-1">{categoryName}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
           <span className="px-3 py-[2px] rounded-full bg-white text-black text-sm">
  {tag}
</span>

          ))}
        </div>
      </div>
    ))}
  </div>
)}

     

      {/* Tag Cards */}
      <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tagCategories">
        {(provided) => (
          <div
            className="mt-4 space-y-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {(searchQuery ? filteredTags : tagCategories).map((category, index) => (
            <Draggable
  key={category.id}
  draggableId={category.id.toString()}
  index={index}
>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}  // add this to the outer div if you want the whole card draggable
      className={`bg-white rounded-xl shadow-sm border p-4 ${
        snapshot.isDragging ? "bg-gray-50" : ""
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-500 h-5 w-5" />
          <h3 className="font-semibold text-lg">{category.title}</h3>
          <span className="text-xs font-semibold text-gray-900 px-2 py-[3px] border border-gray-300 rounded-2xl">
            {category.tags.length} tags
          </span>
        </div>
        <div className="flex items-center gap-1">
        <button
  className="flex items-center gap-2 px-3 py-2 rounded-lg 
             font-medium text-sm transition-all duration-150 
             hover:bg-blue-50 hover:scale-105 active:scale-95"
  onClick={() => {
    setModalType("tag");
    setNewTag("");
    setActiveCategoryId(category.id);
    setOpenModal(true);
  }}
>
  <Plus className="w-4 h-4" /> Add Tag
</button>

  
         {/* Edit Category Icon */}
  <div
    className="flex items-center justify-center h-10 w-10 rounded-lg 
               hover:bg-blue-50 cursor-pointer transition-all duration-150 
               hover:scale-105 active:scale-95"
    onClick={() => handleEditCategory(category)}
  >
    <Pencil className="h-5 w-5 text-gray-700" />
  </div>


         <div
  onClick={() => toggleCategoryCollapse(category.id)}
  className="p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-150
             active:scale-95 flex items-center justify-center"
>
  <ChevronUp
    className={`h-5 w-5 transform transition-transform duration-300
      ${collapsedCategories[category.id] ? "rotate-180" : "rotate-0"}`}
  />
</div>

<div
  onClick={() => {
    setDeleteCategoryId(category.id);
    setOpenDeleteModal(true);
  }}
  className="p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-150 flex items-center justify-center active:scale-95"
>
  <Trash2 className="h-5 w-5 text-red-500" />
</div>

<DeleteModal
  isOpen={openDeleteModal}
  onClose={() => setOpenDeleteModal(false)}
  onConfirm={deleteTagInfo ? handleDeleteTag : handleDeleteCategory}
  title="Are you sure?"
  message="This action cannot be undone."
/>


        </div>
      </div>
     {/* Tags */}
<div className={`flex flex-wrap gap-2 transition-all duration-300 
                ${collapsedCategories[category.id] ? "hidden" : "flex"}`}>
 {category.tags.map((tag) => {
  const isSelected =
    selectedTags[category.title]?.includes(tag.value);

  return (
    <div
      key={tag.id}
      onClick={() => handleTagSelect(category.title, tag.value)}
      className={`group flex items-center px-3 py-[2px] border rounded-full
                  text-sm cursor-pointer transition-all duration-150
                  ${isSelected ? "bg-black text-white" : "bg-white"}
                  hover:scale-110`}
    >
      <span className="whitespace-nowrap text-xs font-semibold">{tag.value}</span>

      {/* icons stay same */}
      <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100">
        {/* edit */}
        <div
          className="flex items-center justify-center p-[2px] rounded-lg
                     hover:bg-blue-50 transition-all hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setModalType("tag");
            setNewTag(tag.value);
            setEditingTag({ categoryId: category.id, tagId: tag.id });
            setOpenModal(true);
          }}
        >
          <Pencil className="h-4 w-4 text-gray-700" />
        </div>

        {/* delete */}
        <div
          className="flex items-center justify-center p-[2px] rounded-lg
                     hover:bg-blue-50 transition-all hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTagInfo({ categoryId: category.id, tagId: tag.id });
            setOpenDeleteModal(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </div>
      </div>
    </div>
  );
})}

</div>


    </div>
  )}
</Draggable>

            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    
    {/* {showToast && (
  <div className="fixed bottom-6 right-12 bg-white text-[14px] font-bold text-gray-700 pl-2 pr-8 py-5 rounded-lg shadow-lg flex items-start gap-2 animate-slide-up">
    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">✓</span>
    Category added successfully!
  </div>
)} */}

    </div>
  );
}

export default Tags;
