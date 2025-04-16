// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


// src/app/page.tsx
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
    setRootFolder, 
    toggleFolderSelection, 
    marks, 
    addMark, 
    startEvaluation 
  } = useEvaluation();
  
  const [newMark, setNewMark] = useState('');
  const [manualPath, setManualPath] = useState('');

  // Handle folder selection via File System Access API
  const handleFolderSelect = async () => {
    const structure = await requestDirectoryAccess();
    if (structure) {
      setRootFolder(structure.root);
    }
  };

  // Handle manual path entry
  const handleManualPathSubmit = () => {
    if (manualPath.trim()) {
      setRootFolder(manualPath.trim());
    }
  };

  // Handle adding a new mark
  const handleAddMark = () => {
    addMark(newMark);
    setNewMark('');
  };

  return (
    <div className="space-y-6">
      {/* Folder Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Root Folder</CardTitle>
          <CardDescription>
            Choose the root folder containing your image folders structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleFolderSelect}>
              Select Folder
            </Button>
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
              <div className="mt-4">
                <div className="text-sm font-medium">Selected folder: {folderStructure.root}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Folder Selection */}
      {folderStructure.root && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Folders to Compare</CardTitle>
            <CardDescription>
              Select which folders you want to include in the comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">Necessary Folders:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="originals" 
                      checked={folderStructure.necessaryFolders.originals}
                      onCheckedChange={() => toggleFolderSelection('originals')}
                    />
                    <label htmlFor="originals" className="text-sm font-medium">
                      originals {folderStructure.necessaryFolders.originals ? '(Found)' : '(Not Found)'}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="target" 
                      checked={folderStructure.necessaryFolders.target}
                      onCheckedChange={() => toggleFolderSelection('target')}
                    />
                    <label htmlFor="target" className="text-sm font-medium">
                      target {folderStructure.necessaryFolders.target ? '(Found)' : '(Not Found)'}
                    </label>
                  </div>
                </div>
              </div>

              {Object.keys(folderStructure.optionalFolders).length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Optional Folders:</h3>
                  <div className="space-y-2">
                    {Object.entries(folderStructure.optionalFolders).map(([folderName, exists]) => (
                      <div key={folderName} className="flex items-center space-x-2">
                        <Checkbox 
                          id={folderName} 
                          checked={folderStructure.selectedFolders.includes(folderName)}
                          onCheckedChange={() => toggleFolderSelection(folderName)}
                        />
                        <label htmlFor={folderName} className="text-sm font-medium">
                          {folderName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marks Creation */}
      {folderStructure.root && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Define Quality Marks</CardTitle>
            <CardDescription>
              Add marks that will be used to evaluate image tuples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newMark}
                  onChange={(e) => setNewMark(e.target.value)}
                  placeholder="Enter quality mark (e.g., Good, Bad, Excellent)"
                />
                <Button onClick={handleAddMark}>Add Mark</Button>
              </div>

              {marks.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Defined Marks:</h3>
                  <div className="flex flex-wrap gap-2">
                    {marks.map((mark) => (
                      <div 
                        key={mark.id} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {mark.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={startEvaluation}
              disabled={
                folderStructure.selectedFolders.length < 2 || 
                marks.length === 0 ||
                !(folderStructure.necessaryFolders.originals && folderStructure.necessaryFolders.target)
              }
            >
              Start Evaluation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}