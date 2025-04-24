// // src/app/page.tsx
// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { requestDirectoryAccess } from '@/utils/folderUtils';

// export default function Home() {
//   const { 
//     folderStructure, 
//     setRootFolder, 
//     toggleFolderSelection, 
//     marks, 
//     addMark, 
//     startEvaluation 
//   } = useEvaluation();
  
//   const [newMark, setNewMark] = useState('');
//   const [manualPath, setManualPath] = useState('');

//   // Handle folder selection via File System Access API
//   const handleFolderSelect = async () => {
//     const structure = await requestDirectoryAccess();
//     if (structure) {
//       setRootFolder(structure.root);
//     }
//   };

//   // Handle manual path entry
//   const handleManualPathSubmit = () => {
//     if (manualPath.trim()) {
//       setRootFolder(manualPath.trim());
//     }
//   };

//   // Handle adding a new mark
//   const handleAddMark = () => {
//     addMark(newMark);
//     setNewMark('');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Folder Selection Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Step 1: Select Root Folder</CardTitle>
//           <CardDescription>
//             Choose the root folder containing your image folders structure
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col space-y-4">
//             <Button onClick={handleFolderSelect}>
//               Select Folder
//             </Button>
//             <div className="text-sm text-gray-500">Or enter path manually:</div>
//             <div className="flex space-x-2">
//               <Input
//                 value={manualPath}
//                 onChange={(e) => setManualPath(e.target.value)}
//                 placeholder="/path/to/your/root/folder"
//               />
//               <Button variant="outline" onClick={handleManualPathSubmit}>
//                 Set Path
//               </Button>
//             </div>
            
//             {folderStructure.root && (
//               <div className="mt-4">
//                 <div className="text-sm font-medium">Selected folder: {folderStructure.root}</div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Folder Selection */}
//       {folderStructure.root && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Step 2: Select Folders to Compare</CardTitle>
//             <CardDescription>
//               Select which folders you want to include in the comparison
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-md font-medium mb-2">Necessary Folders:</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox 
//                       id="originals" 
//                       checked={folderStructure.necessaryFolders.originals}
//                       onCheckedChange={() => toggleFolderSelection('originals')}
//                     />
//                     <label htmlFor="originals" className="text-sm font-medium">
//                       originals {folderStructure.necessaryFolders.originals ? '(Found)' : '(Not Found)'}
//                     </label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox 
//                       id="target" 
//                       checked={folderStructure.necessaryFolders.target}
//                       onCheckedChange={() => toggleFolderSelection('target')}
//                     />
//                     <label htmlFor="target" className="text-sm font-medium">
//                       target {folderStructure.necessaryFolders.target ? '(Found)' : '(Not Found)'}
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {Object.keys(folderStructure.optionalFolders).length > 0 && (
//                 <div>
//                   <h3 className="text-md font-medium mb-2">Optional Folders:</h3>
//                   <div className="space-y-2">
//                     {Object.entries(folderStructure.optionalFolders).map(([folderName, exists]) => (
//                       <div key={folderName} className="flex items-center space-x-2">
//                         <Checkbox 
//                           id={folderName} 
//                           checked={folderStructure.selectedFolders.includes(folderName)}
//                           onCheckedChange={() => toggleFolderSelection(folderName)}
//                         />
//                         <label htmlFor={folderName} className="text-sm font-medium">
//                           {folderName}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Marks Creation */}
//       {folderStructure.root && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Step 3: Define Quality Marks</CardTitle>
//             <CardDescription>
//               Add marks that will be used to evaluate image tuples
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex space-x-2">
//                 <Input
//                   value={newMark}
//                   onChange={(e) => setNewMark(e.target.value)}
//                   placeholder="Enter quality mark (e.g., Good, Bad, Excellent)"
//                 />
//                 <Button onClick={handleAddMark}>Add Mark</Button>
//               </div>

//               {marks.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="text-md font-medium mb-2">Defined Marks:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {marks.map((mark) => (
//                       <div 
//                         key={mark.id} 
//                         className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
//                       >
//                         {mark.label}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-end">
//             <Button 
//               onClick={startEvaluation}
//               disabled={
//                 folderStructure.selectedFolders.length < 2 || 
//                 marks.length === 0 ||
//                 !(folderStructure.necessaryFolders.originals && folderStructure.necessaryFolders.target)
//               }
//             >
//               Start Evaluation
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { requestDirectoryAccess } from '@/utils/folderUtils';

export default function Home() {
  const { 
    folderStructure, 
    setFolderStructure, 
    toggleFolderSelection, 
    marks, 
    addMark, 
    startEvaluation 
  } = useEvaluation();
  
  const [newMark, setNewMark] = useState('');
  const [manualPath, setManualPath] = useState('');

  // Handle folder selection using File System Access API
  const handleFolderSelect = async () => {
    const structure = await requestDirectoryAccess();
    if (structure) {
      setFolderStructure(structure);
    }
  };

  // const handleManualPathSubmit = () => {
  //   if (manualPath.trim()) {
  //     setFolderStructure({
  //       root: manualPath.trim(),
  //       optionalFolders: {}, // This can be filled by later file system scan
  //       selectedFolders: [],
  //     });
  //   }
  // };
  const handleManualPathSubmit = () => {
    if (manualPath.trim()) {
      setFolderStructure({
        root: manualPath.trim(),
        optionalFolders: {},       // Will be filled after scanning
        selectedFolders: [],
        availableFolders: {},     
      });
    }
  };
  

  const handleAddMark = () => {
    if (newMark.trim()) {
      addMark(newMark);
      setNewMark('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Root Folder */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Root Folder</CardTitle>
          <CardDescription>
            Choose the root folder containing your image comparison folders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleFolderSelect}>Select Folder</Button>
            <div className="text-sm text-gray-500">Or enter path manually:</div>
            <div className="flex space-x-2">
              <Input
                value={manualPath}
                onChange={(e) => setManualPath(e.target.value)}
                placeholder="/path/to/your/root/folder"
              />
              <Button variant="outline" onClick={handleManualPathSubmit}>
                Set Path
              </Button>
            </div>
            {folderStructure.root && (
              <div className="mt-4 text-sm font-medium">
                Selected root folder: {folderStructure.root}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Select Folders to Compare */}
      {folderStructure.root && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Choose Folders to Compare</CardTitle>
              <CardDescription>
                All folders inside your root are listed below. Select which ones you want to include in the comparison.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {folderStructure.availableFolders && Object.keys(folderStructure.availableFolders).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(folderStructure.availableFolders).map(([folderName, exists]) => (
                  <div key={folderName} className="flex items-center space-x-2">
                    {/* Render folder here */}
                  </div>
                ))}
              </div>
            ) : (
              <div>No available folders</div>
            )}

            </CardContent>
          </Card>
        )}


      {/* Step 3: Define Marks */}
      {folderStructure.root && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Define Evaluation Marks</CardTitle>
            <CardDescription>
              Add marks to label images during evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newMark}
                  onChange={(e) => setNewMark(e.target.value)}
                  placeholder="e.g. Good, Needs Improvement"
                />
                <Button onClick={handleAddMark}>Add Mark</Button>
              </div>

              {marks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Defined Marks:</h3>
                  <div className="flex flex-wrap gap-2">
                    {marks.map((mark) => (
                      <span
                        key={mark.id}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {mark.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={startEvaluation}
              disabled={folderStructure.selectedFolders.length < 2 || marks.length === 0}
            >
              Start Evaluation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

