"use client";
import { useState, useEffect } from "react";
import { toJpeg } from "html-to-image";
import React from "react";
import Image from 'next/image';
interface Produto {
  codigo: string;
  nome: string;
  preco: number;
  inicio: string;
  fim: string;
  imagem: string; // Agora faz parte da interface Produto
}

interface ColorScheme {
  currencyColor: string;
  priceColor: string;
}

export default function VisualizationPage() {
  const [mainBackground, setMainBackground] = useState<string | null>(null);
  const [subsequentBackground, setSubsequentBackground] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]); // Carregar diretamente
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 12;
  const inicio: string = produtos[0]?.inicio || "";
  const fim: string = produtos[0]?.fim || "";
  // Estado para edição de nome do produto
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [fontSizes, setFontSizes] = useState<number[]>([]); // Estado para tamanhos individuais das fontes

  // Esquema de cores para a moeda e preço
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    currencyColor: "#000",
    priceColor: "#000",
  });

  // Estados para personalização de imagens
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number; scale: number }[]>([]);
   
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  // Carregar produtos e outras informações do localStorage
  useEffect(() => {
    const background = localStorage.getItem("mainBackground");
    const secBackground = localStorage.getItem("subsequentBackground");
    const produtosStr = localStorage.getItem("produtos");
    const storedColorScheme = localStorage.getItem("selectedColor");
    if (background) {
        setMainBackground(`http://localhost:3001${background}`);
      }
      if (secBackground) {
        setSubsequentBackground(`http://localhost:3001${secBackground}`);
      }
    if (produtosStr) {
      const produtos: Produto[] = JSON.parse(produtosStr);
      setProdutos(produtos);

      // Inicializar posições das imagens
      const initialPositions = produtos.map(() => ({ x: 0, y: 0, scale: 1 }));
      setPositions(initialPositions);

      // Inicializar tamanhos das fontes
      const initialFontSizes = produtos.map(() => 13);
      setFontSizes(initialFontSizes);
    }

    if (storedColorScheme) {
      const colorScheme = JSON.parse(storedColorScheme);
      setColorScheme({
        currencyColor: colorScheme.currencyColor,
        priceColor: colorScheme.priceColor,
      });
    }
  }, []);

  const produtosPaginados = produtos.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const cloneNodeWithInlineStyles = (element: HTMLElement): HTMLElement => {
    // Clona o elemento e informa que é um HTMLElement
    const clone = element.cloneNode(true) as HTMLElement;
    const computedStyle = window.getComputedStyle(element);
  
    // Itera sobre os estilos computados e aplica no clone
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      // Aplica o estilo no clone
      clone.style.setProperty(property, computedStyle.getPropertyValue(property));
    }
  
    return clone;
  };
  const handleGenerateJPEG = () => {
    setIsGenerating(true);
    setProgress(0);
    
    const encarteElement = document.getElementById("encarte");
    if (encarteElement) {
      const clone = cloneNodeWithInlineStyles(encarteElement); // Clona o elemento com estilos inline
      document.body.appendChild(clone); // Adiciona o clone ao DOM temporariamente

      toJpeg(clone, { quality: 0.95 })
        .then((dataUrl) => {
          setProgress(50);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "encarte.jpg";
          link.click();

          setProgress(100);
          setTimeout(() => setIsGenerating(false), 1000);
        })
        .catch((error) => {
          console.error("Error generating JPEG", error);
          setIsGenerating(false);
        });
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (selectedImageIndex === null) return;
    const newPosition = [...positions];
    newPosition[selectedImageIndex] = {
      ...newPosition[selectedImageIndex],
      [axis]: value,
    };
    setPositions(newPosition);
  };

  const handleScaleChange = (value: number) => {
    if (selectedImageIndex === null) return;
    const newPosition = [...positions];
    newPosition[selectedImageIndex] = {
      ...newPosition[selectedImageIndex],
      scale: value,
    };
    setPositions(newPosition);
  };

  const handleCompleteChanges = () => {
    setSelectedImageIndex(null);
  };

  const handleNameClick = (index: number, currentName: string) => {
    setEditingIndex(index); // Define o índice do produto que está sendo editado
    setEditedName(currentName); // Preenche o campo de edição com o nome atual
  };

  const handleNameSave = () => {
    if (editingIndex !== null) {
      const updatedProdutos = [...produtos];
      updatedProdutos[editingIndex].nome = editedName; // Atualiza o nome do produto no array
      setProdutos(updatedProdutos); // Atualiza o estado com o novo array de produtos
      setEditingIndex(null); // Finaliza a edição, limpando o índice
      setEditedName(""); // Reseta o nome editado
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedName(e.target.value);
  };

  // Função para alterar tamanho da fonte dinamicamente para um produto específico
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFontSizes = [...fontSizes];
    newFontSizes[index] = Number(e.target.value);
    setFontSizes(newFontSizes);
  };

  return (
    <div className="container mx-auto p-12">
      {/* Exibir os produtos com imagens associadas, paginados */}
      <div
        id="encarte"
        className={`container-a4 ${paginaAtual === 1 ? "first-page" : ""}`}
        style={{
          backgroundImage: `url(${
            paginaAtual === 1 ? mainBackground : subsequentBackground
          })`,
        }}
        >
        <div className="page-content">
          {produtosPaginados.length > 0 &&
            produtosPaginados.map((produto, index) => (
              <div key={index} className="product-card" style={{ position: "relative" }}>
                {/* Verifica se o índice atual está em edição */}
                
                {editingIndex === index ? (
                <div className="flex flex-col">
                    <textarea
                      value={editedName}
                      onChange={handleNameChange}
                      className="border rounded p-1"
                      rows={2}
                      style={{
                        fontSize: `${fontSizes[index]}px`, // Adapta o tamanho da fonte individualmente
                        


                        height: 'auto', // Ajusta automaticamente a altura
                        width: '100%', // Garante que tenha a mesma largura que o nome do produto
                      }}
                    />

                    <label className="mt-2">Tamanho da Fonte:</label>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      value={fontSizes[index]}
                      onChange={(e) => handleFontSizeChange(e, index)}
                      className="mt-1"
                    />

                    <button
                      onClick={handleNameSave}
                      className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Salvar
                    </button>
                </div>
              ) : (
                <h4
                    className="product-name cursor-pointer"
                    onClick={() => handleNameClick(index, produto.nome)} // Abre o modo de edição
                    style={{
                      fontSize: `${fontSizes[index]}px` // Controla o tamanho da fonte individualmente no nome do produto
                    }}
                >
                    {editingIndex === index ? editedName : produto.nome}
                </h4>
              )}


                {/* Div que envolve a imagem para garantir que fique abaixo do texto */}
                <div
                  className="product-img-space"
                  onClick={() => handleImageClick(index)}
                  style={{
                    position: "relative",
                    marginTop: "10px",
                    cursor: "pointer",
                    transform: `translate(${positions[index].x}px, ${positions[index].y}px) scale(${positions[index].scale})`,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <Image
                   src={produto.imagem}
                   alt={`Produto ${index + 1}`}
                   width={150}  // Definindo explicitamente o width
                   height={150} // Definindo explicitamente o height
                   unoptimized={true}  // Mantendo a otimização desativada
                   style={{
                     objectFit: "contain",
                   }}
                 />
               </div>

               {/* Caixa flutuante de controles que aparece ao lado da imagem selecionada */}
               {selectedImageIndex === index && (
                 <div className="absolute bg-white p-4 shadow-lg z-10" style={{ top: '0', left: '160px' }}>
                   <h3 className="font-semibold text-lg mb-2">Controles da Imagem</h3>
                   <div className="flex flex-col space-y-4">
                     <div>
                       <label>Posição Vertical</label>
                       <input
                         type="range"
                         min="-100"
                         max="100"
                         value={positions[selectedImageIndex]?.y || 0}
                         onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                       />
                     </div>

                     <div>
                       <label>Posição Horizontal</label>
                       <input
                         type="range"
                         min="-100"
                         max="100"
                         value={positions[selectedImageIndex]?.x || 0}
                         onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                       />
                     </div>

                     <div>
                       <label>Escala</label>
                       <input
                         type="range"
                         min="0.5"
                         max="2"
                         step="0.1"
                         value={positions[selectedImageIndex]?.scale || 1}
                         onChange={(e) => handleScaleChange(Number(e.target.value))}
                       />
                     </div>

                     <button onClick={handleCompleteChanges} className="bg-blue-500 text-white px-4 py-2 rounded">
                       Concluir Ajustes
                     </button>
                   </div>
                 </div>
               )}

               <div className="product-price" 
                 style={{
                  boxShadow: '0 3px 3px #777', // Adiciona a sombra
                  // Outros estilos podem ser aplicados aqui, se necessário
                }}
                >
                 <span
                   className="currency"
                   style={{ backgroundColor: colorScheme.currencyColor,
                       fontSize: String(produto.preco).length > 5 ? '27px' : '29px',
                   }}
                 >
                   R$
                 </span>
                 <span
                   className="price"
                   style={{ 
                       color: colorScheme.priceColor,
                       fontSize: String(produto.preco).length > 5 ? '27px' : '31px',
                   }}
                 >
                   {produto.preco}
                 </span>
               </div>
             </div>
           ))}
       </div>

         <div className="mt-8 text-center text-lg font-bold data">
           {inicio && fim ? (
             <p>VÁLIDO DE {inicio} ATÉ {fim}</p>
           ) : (
             <p>VÁLIDO DE 21/09/2024 ATÉ 06/10/2024</p>
           )}
         </div>
       
     </div>

     {/* Popup de carregamento com barra de progresso */}
     {isGenerating && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
         <div className="bg-white p-6 rounded-lg shadow-lg">
           <h3 className="text-xl font-bold mb-4">Gerando JPEG...</h3>
           <div className="w-full bg-gray-200 rounded-full h-4">
             <div
               className="bg-blue-500 h-4 rounded-full"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
           {progress === 100 ? (
             <p className="mt-4 text-green-500 font-bold">Concluído!</p>
           ) : (
             <p className="mt-4">Progresso: {progress}%</p>
           )}
         </div>
       </div>
     )}

     {/* Botões de controle */}
     <div className="flex justify-between mt-8">
       <button
         onClick={() => setPaginaAtual(paginaAtual - 1)}
         disabled={paginaAtual === 1}
         className="bg-gray-300 px-4 py-2 rounded"
       >
         Página Anterior
       </button>
       <button
         onClick={() => setPaginaAtual(paginaAtual + 1)}
         disabled={produtos.length <= paginaAtual * produtosPorPagina}
         className="bg-gray-300 px-4 py-2 rounded"
       >
         Próxima Página
       </button>
       <button onClick={handleGenerateJPEG} className="bg-blue-500 text-white px-4 py-2 rounded">
         Gerar JPEG
       </button>
     </div>
   </div>
 );
}
