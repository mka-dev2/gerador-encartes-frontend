"use client";

import { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import PlanilhaUploader from "../components/PlanilhaUploader";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

// Definindo as cores padrão
const colors = [
  { id: 1, name: "Verde", currencyColor: "#33cc99", priceColor: "#087945" },
  { id: 2, name: "Amarelo", currencyColor: "#ffd404", priceColor: "#766308" },
];

// Função para enviar os arquivos ao backend
const uploadImageToServer = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://localhost:3001/upload", { // URL do backend
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem");
  }

  const data = await response.json();
  return data.path; // O caminho da imagem no servidor
};

export default function UploadPage() {
  const [mainBackground, setMainBackground] = useState<File | null>(null);
  const [subsequentBackground, setSubsequentBackground] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>([]); // URLs das imagens carregadas
  const [uploadedMainBackground, setUploadedMainBackground] = useState<string | null>(null); // URL do background carregado
  const [uploadedSubsequentBackground, setUploadedSubsequentBackground] = useState<string | null>(null); // URL do background carregado
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [uploadStatus, setUploadStatus] = useState({
    mainBackground: false,
    subsequentBackground: false,
    productImages: false,
    produtos: false,
  });

  const router = useRouter();

  // Carregar status de upload
  useEffect(() => {
    if (uploadedMainBackground) {
      setUploadStatus((prev) => ({ ...prev, mainBackground: true }));
    }
    if (uploadedSubsequentBackground) {
      setUploadStatus((prev) => ({ ...prev, subsequentBackground: true }));
    }
    if (uploadedProductImages.length > 0) {
      setUploadStatus((prev) => ({ ...prev, productImages: true }));
    }
    if (produtos.length > 0) {
      setUploadStatus((prev) => ({ ...prev, produtos: true }));
    }
  }, [uploadedMainBackground, uploadedSubsequentBackground, uploadedProductImages, produtos]);

  // Lidar com o upload das imagens de background
  const handleBackgroundUpload = async (file: File, isMain: boolean) => {
    try {
      const uploadedFile = await uploadImageToServer(file);
      if (isMain) {
        setUploadedMainBackground(uploadedFile);
        setMainBackground(file);
      } else {
        setUploadedSubsequentBackground(uploadedFile);
        setSubsequentBackground(file);
      }
    } catch (error) {
      console.error("Erro ao fazer upload do background:", error);
    }
  };

  // Lidar com o upload das imagens de produtos
  const handleProductImagesUpload = async (files: File[]) => {
    try {
      const uploadedFiles = await Promise.all(files.map(uploadImageToServer));
      setUploadedProductImages(uploadedFiles);
      setProductImages(files); // Manter arquivos originais, se necessário
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
    }
  };

  // Enviar informações para localStorage
  const handleSubmit = () => {
    if (uploadedMainBackground) {
      localStorage.setItem("mainBackground", uploadedMainBackground);
    }

    if (uploadedSubsequentBackground) {
      localStorage.setItem("subsequentBackground", uploadedSubsequentBackground);
    }

    if (uploadedProductImages.length > 0) {
      localStorage.setItem("productImages", JSON.stringify(uploadedProductImages));
    }

    if (produtos.length > 0) {
      localStorage.setItem("produtos", JSON.stringify(produtos));
    }

    localStorage.setItem("selectedColor", JSON.stringify(selectedColor));
    router.push("/previa");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Gerador de Encartes - Upload</h1>

      {/* Upload do background da tela principal */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Background da Tela Principal</h2>
        <FileUploader onFilesUploaded={(files) => handleBackgroundUpload(files[0], true)} />
        {uploadStatus.mainBackground && (
          <p className="text-green-500 mt-2">Background principal carregado com sucesso!</p>
        )}
      </div>

      {/* Upload do background das telas secundárias */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Background das Telas Secundárias</h2>
        <FileUploader onFilesUploaded={(files) => handleBackgroundUpload(files[0], false)} />
        {uploadStatus.subsequentBackground && (
          <p className="text-green-500 mt-2">Background secundário carregado com sucesso!</p>
        )}
      </div>

      {/* Upload das imagens dos produtos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Imagens dos Produtos</h2>
        <FileUploader onFilesUploaded={handleProductImagesUpload} />
        {uploadStatus.productImages && (
          <p className="text-green-500 mt-2">Imagens dos produtos carregadas com sucesso!</p>
        )}
      </div>

      {/* Upload da planilha de produtos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Upload da Planilha de Produtos</h2>
        <PlanilhaUploader onProductsUploaded={setProdutos} />
        {uploadStatus.produtos && (
          <p className="text-green-500 mt-2">Planilha de produtos carregada com sucesso!</p>
        )}
      </div>

      {/* Seleção de cor padrão */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Cor Padrão</h2>

        <Listbox value={selectedColor} onChange={setSelectedColor}>
          <label className="block text-sm font-medium leading-6 text-gray-900">Cor da Moeda e Preço</label>
          <div className="relative mt-2">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span
                  className="inline-block h-5 w-5 rounded-full"
                  style={{ backgroundColor: selectedColor.currencyColor }}
                ></span>
                <span className="ml-3 block truncate">{selectedColor.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {colors.map((color) => (
                <ListboxOption
                  key={color.id}
                  value={color}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
                >
                  <div className="flex items-center">
                    <span
                      className="inline-block h-5 w-5 rounded-full"
                      style={{ backgroundColor: color.currencyColor }}
                    ></span>
                    <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                      {color.name}
                    </span>
                  </div>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {/* Botão de enviar */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Visualizar Encarte
      </button>
    </div>
  );
}