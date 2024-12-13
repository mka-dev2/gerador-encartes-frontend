"use client";
import ExcelJS, { CellErrorValue, CellFormulaValue, CellHyperlinkValue, CellRichTextValue, CellSharedFormulaValue } from 'exceljs';
import React from 'react';

interface Produto {
  codigo: string;
  nome: string;
  descricao: string;
  preco: string; // Preço como string formatado
  imagem: string; // Caminho da imagem associada ao código
  inicio: string;
  fim: string;
}
type ExcelCellValue = string | number | Date | boolean | CellErrorValue | CellRichTextValue | CellHyperlinkValue | CellFormulaValue | CellSharedFormulaValue;

interface PlanilhaUploaderProps {
  onProductsUploaded: (produtos: Produto[]) => void;
}

const convertExcelDate = (excelDate: ExcelCellValue): string => {
  if (typeof excelDate === 'number') {
    // Verifica se é um número e converte a partir de uma data serializada do Excel
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toLocaleDateString('pt-BR');
  } else if (typeof excelDate === 'string') {
    // Caso seja uma string no formato dd/mm/yyyy
    return excelDate;
  } else if (excelDate instanceof Date) {
    // Caso já seja uma instância de Date
    return excelDate.toLocaleDateString('pt-BR');
  } else {
    // Para outros tipos (boolean, CellErrorValue, CellRichTextValue, etc.)
    // Retornamos uma string vazia, pois esses não são valores válidos de data
    return '';
  }
};

// Função para remover códigos do início do nome do produto
const tratarNomeProduto = (nomeCompleto: string | undefined): string => {
  if (!nomeCompleto || typeof nomeCompleto !== 'string') {
    return ''; // Retorna uma string vazia se o nome for inválido
  }

  // Expressão regular para remover códigos no início e manter apenas o nome do produto
  // const regex = /^[A-Za-z0-9\-]*[ ]?(-|–)[ ]?/;
  
  // Aplica a regex ao nome completo para remover a parte inicial indesejada
  // const nomeTratado = nomeCompleto.replace(regex, '').trim();

  return nomeCompleto;
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
          let data_inicio = '';
          let data_fim = '';

          // Lê as datas de início e fim da promoção na segunda linha, com verificação
          const inicioData = worksheet.getRow(2).getCell(4).value;
          const fimData = worksheet.getRow(2).getCell(5).value;

          if (inicioData) {
            data_inicio = convertExcelDate(inicioData);
          }
          if (fimData) {
            data_fim = convertExcelDate(fimData);
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
                  preco: parseFloat(row.getCell(3).value?.toString() || '0').toFixed(2).replace(".", ","),
                  inicio: data_inicio || '',
                  fim: data_fim || '',
                  imagem: `https://encarte-be.likedsg.com/upload/${nomeImagem}`,
                };
                produtos.push(produto);
              }
            }
          });

          // Envia os produtos e as datas para o componente pai
          onProductsUploaded(produtos);

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
