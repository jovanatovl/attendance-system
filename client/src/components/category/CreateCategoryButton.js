import React, { useContext } from 'react';
import GlobalContext from '../../context/GlobalContext';

const CreateCategoryButton = () => {
  const { setShowCategoriesModal } = useContext(GlobalContext);

  return (
    <div
      onClick={() => setShowCategoriesModal(true)}
      className='border mt-2 p-2 rounded-full flex cursor-pointer items-center shadow-md hover:shadow-2xl'
    >
      <span className='material-icons-outlined  text-gray-600 mx-2'>add</span>
      <span>Create Category</span>
    </div>
  );
};

export default CreateCategoryButton;
