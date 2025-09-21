import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import XLSX from 'xlsx';
import { parseWineData } from '@monorepo/shared-logic';

export const loadWineData = async () => {
  try {
    const asset = Asset.fromModule(require('../../assets/output_regression_results.xlsx'));
    await asset.downloadAsync();
    
    const fileData = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    const workbook = XLSX.read(fileData, { type: 'base64' });
    return parseWineData(workbook);
  } catch (error) {
    console.error('Failed to load wine data:', error);
    return [];
  }
};
