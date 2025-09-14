import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import XLSX from 'xlsx';

export const loadData = async () => {
  const asset = Asset.fromModule(require('../../assets/output_regression_results.xlsx'));
  await asset.downloadAsync();
  const file = await FileSystem.readAsStringAsync(asset.localUri, { encoding: 'base64' });
  const workbook = XLSX.read(file, { type: 'base64' });
  return workbook.Sheets; // Adjust based on your web parsing logic
};