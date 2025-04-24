// // src/app/evaluation/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { useRouter } from 'next/navigation';
// import { calculatePercentage } from '@/utils/statisticsUtils';
// import Image from 'next/image';

// export default function EvaluationPage() {
//   const { 
//     imageTuples, 
//     currentTupleIndex, 
//     marks, 
//     assignMark, 
//     evaluationResults,
//     endEvaluation,
//     goToNextTuple
//   } = useEvaluation();
  
//   const router = useRouter();
  
//   // State for the current tuple
//   const [currentTuple, setCurrentTuple] = useState(imageTuples[currentTupleIndex]);
  
//   // State for image URLs (simulate with placeholder images for now)
//   const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  
//   // Update current tuple when index changes
//   useEffect(() => {
//     if (imageTuples.length === 0) {
//       // No tuples available, redirect to home
//       router.push('/');
//       return;
//     }
    
//     setCurrentTuple(imageTuples[currentTupleIndex]);
    
//     // Generate placeholder image URLs for demonstration
//     const urls: Record<string, string> = {};
//     Object.keys(imageTuples[currentTupleIndex].paths).forEach((folder) => {
//       // In a real implementation, we'd get actual image URLs from the file system
//       // For demo purposes, we're using placeholder images
//       urls[folder] = `/api/placeholder/400/320?text=${folder}/${imageTuples[currentTupleIndex].filename}`;
//     });
    
//     setImageUrls(urls);
//   }, [currentTupleIndex, imageTuples, router]);
  
//   // Calculate progress
//   const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  
//   // Check if current tuple has been evaluated
//   const currentTupleEvaluated = evaluationResults.some(result => result.tupleId === currentTuple?.id);
  
//   // Handle mark selection
//   const handleMarkSelect = (markId: string) => {
//     if (currentTuple) {
//       assignMark(currentTuple.id, markId);
//     }
//   };
  
//   // Handle next tuple
//   const handleNext = () => {
//     goToNextTuple();
//   };
  
//   // Handle end evaluation
//   const handleEnd = () => {
//     endEvaluation();
//   };
  
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Evaluate Image Tuple {currentTupleIndex + 1}/{imageTuples.length}</CardTitle>
//           <div className="mt-2">
//             <Progress value={progress} className="h-2" />
//             <div className="text-sm text-gray-500 mt-1">
//               Progress: {evaluationResults.length}/{imageTuples.length} ({progress}%)
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {currentTuple && (
//             <>
//               <div className="text-sm font-medium mb-4">
//                 Filename: {currentTuple.filename}
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(imageUrls).map(([folder, url]) => (
//                   <div key={folder} className="flex flex-col items-center">
//                     <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
//                       <Image 
//                         src={url}
//                         alt={`${folder} image`}
//                         fill
//                         style={{ objectFit: 'contain' }}
//                       />
//                     </div>
//                     <div className="mt-2 text-sm font-medium">
//                       {folder}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-8">
//                 <h3 className="text-md font-medium mb-2">Select quality mark:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {marks.map((mark) => (
//                     <Button
//                       key={mark.id}
//                       variant="outline"
//                       onClick={() => handleMarkSelect(mark.id)}
//                       className="min-w-20"
//                     >
//                       {mark.label}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button 
//             variant="outline"
//             onClick={handleNext}
//             disabled={currentTupleIndex >= imageTuples.length - 1}
//           >
//             Next
//           </Button>
//           <Button 
//             onClick={handleEnd}
//           >
//             End Evaluation
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useEvaluation } from '@/contexts/EvaluationContext';
import { calculatePercentage } from '@/utils/statisticsUtils';

export default function EvaluationPage() {
  const { 
    imageTuples, 
    currentTupleIndex, 
    marks, 
    assignMark, 
    evaluationResults,
    endEvaluation,
    goToNextTuple
  } = useEvaluation();
  
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const currentTuple = imageTuples[currentTupleIndex];

  // Redirect if no tuples exist
  useEffect(() => {
    if (imageTuples.length === 0) {
      router.push('/');
    }
  }, [imageTuples, router]);

  // Generate placeholder image URLs
  useEffect(() => {
    if (!currentTuple) return;

    const urls: Record<string, string> = {};
    Object.entries(currentTuple.paths).forEach(([folder, path]) => {
      // Simulated placeholder image URL – replace this logic with actual file access if needed
      urls[folder] = `/api/placeholder/400/320?text=${folder}/${currentTuple.filename}`;
    });

    setImageUrls(urls);
  }, [currentTuple]);

  const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  const isLastTuple = currentTupleIndex >= imageTuples.length - 1;
  const currentTupleEvaluated = evaluationResults.some(result => result.tupleId === currentTuple?.id);

  const handleMarkSelect = (markId: string) => {
    if (currentTuple) {
      assignMark(currentTuple.id, markId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Evaluate Image Tuple {currentTupleIndex + 1} / {imageTuples.length}
          </CardTitle>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-gray-500 mt-1">
              Progress: {evaluationResults.length}/{imageTuples.length} ({progress}%)
            </div>
          </div>
        </CardHeader>

        {currentTuple && (
          <>
            <CardContent>
              <div className="text-sm font-medium mb-4">
                Filename: {currentTuple.filename}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(imageUrls).map(([folder, url]) => (
                  <div key={folder} className="flex flex-col items-center">
                    <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
                      <Image 
                        src={url}
                        alt={`${folder} image`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium">{folder}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-md font-medium mb-2">Select quality mark:</h3>
                <div className="flex flex-wrap gap-2">
                  {marks.map((mark) => (
                    <Button
                      key={mark.id}
                      variant={currentTupleEvaluated ? "outline" : "default"}
                      onClick={() => handleMarkSelect(mark.id)}
                      className="min-w-20"
                    >
                      {mark.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={goToNextTuple}
                disabled={isLastTuple || !currentTupleEvaluated}
              >
                Next
              </Button>
              <Button onClick={endEvaluation}>
                End Evaluation
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
