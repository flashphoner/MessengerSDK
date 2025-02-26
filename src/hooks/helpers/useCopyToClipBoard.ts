import { useState } from "react";

const useCopyToClipboard = (): [(text: string) => void, boolean] => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 500);
        })
        .catch((error) => {
          console.error("Failed to copy: ", error);
        });
    } else {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        // ios specific command
        textArea.setSelectionRange(0, 99999);

        const successful = document.execCommand("copy");
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 500);
        } else {
          console.error("Fallback copy command failed");
        }

        document.body.removeChild(textArea);
      } catch (error) {
        console.error("Unable to copy using fallback method: ", error);
      }
    }
  };

  return [copyToClipboard, isCopied];
};

export default useCopyToClipboard;
