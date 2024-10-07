"use client";
import ExcelJS from 'exceljs';
import React from 'react';

interface Produto {
  codigo: string;
  nome: string;
  descricao: string;
  preco: string; // Preço como string formatado
  imagem: string; // Caminho da imagem associada ao código
}

interface PlanilhaUploaderProps {
  onProductsUploaded: (produtos: Produto[], inicio: string, fim: string) => void;
}

// Função para converter datas Excel para o formato legível
const convertExcelDate = (excelDate: any): string => {
  if (typeof excelDate === 'number') {
    // Verifica se é um número e converte a partir de uma data serializada do Excel
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toLocaleDateString('pt-BR');
  } else if (excelDate instanceof Date) {
    // Caso já seja uma instância de Date
    return excelDate.toLocaleDateString('pt-BR');
  }
  return ''; // Se não for uma data válida, retorna uma string vazia
};

// Função para remover códigos do início do nome do produto
const tratarNomeProduto = (nomeCompleto: string | undefined): string => {
  if (!nomeCompleto || typeof nomeCompleto !== 'string') {
    return ''; // Retorna uma string vazia se o nome for inválido
  }

  // Expressão regular para remover códigos no início e manter apenas o nome do produto
  const regex = /^[A-Za-z0-9\-]*[ ]?(-|–)[ ]?/;
  
  // Aplica a regex ao nome completo para remover a parte inicial indesejada
  const nomeTratado = nomeCompleto.replace(regex, '').trim();

  return nomeTratado;
};

export default function PlanilhaUploader({ onProductsUploaded }: PlanilhaUploaderProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          
          // Criar uma instância do ExcelJS Workbook e ler os dados
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(data); // Carregar o arquivo .xlsx

          const worksheet = workbook.worksheets[0]; // Usar a primeira planilha
          
          const produtos: Produto[] = [];
          let inicio = '';
          let fim = '';

          // Lê as datas de início e fim da promoção na segunda linha, com verificação
          const inicioData = worksheet.getRow(2).getCell(6).value;
          const fimData = worksheet.getRow(2).getCell(7).value;

          if (inicioData) {
            inicio = convertExcelDate(inicioData);
          }
          if (fimData) {
            fim = convertExcelDate(fimData);
          }

          // Itera sobre as linhas da planilha para processar os produtos
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Ignora o cabeçalho
              const codigo = row.getCell(1).value?.toString() || '';
              const nomeImagem = `${codigo}.webp`;

              // Filtra as linhas que têm código de produto
              if (codigo) {
                const produto: Produto = {
                  codigo: codigo,
                  nome: tratarNomeProduto(row.getCell(2).value?.toString()),
                  descricao: row.getCell(2).value?.toString() || '',
                  preco: parseFloat(row.getCell(5).value?.toString() || '0').toFixed(2).replace(".", ","),
                  imagem: `http://localhost:3001/uploads/${nomeImagem}`,
                };
                produtos.push(produto);
              }
            }
          });

          console.log('Produtos da planilha:', produtos);
          console.log('Data de início:', inicio);
          console.log('Data de fim:', fim);

          // Envia os produtos e as datas para o componente pai
          onProductsUploaded(produtos, inicio, fim);

        } catch (error) {
          console.error("Erro ao processar a planilha:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}