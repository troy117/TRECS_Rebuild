package photo.software.render;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import org.apache.poi.hssf.usermodel.HSSFFooter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Footer;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.comparators.OrderUnitStudentClassSortComparator;
import photo.software.comparators.OrderUnitStudentGradeSortComparator;
import photo.software.comparators.OrderUnitStudentLastNameSortComparator;
import photo.software.login.SchoolData;


public class RenderExcelReport 
{
	Workbook wb;
	Sheet sheet;
	Footer footer;
	Row row;
	Cell cell;
	
	public RenderExcelReport(SchoolData schoolData, ArrayList<RenderOrder> orders, String output, int sort)
	{
		
		if(sort==0) Collections.sort(orders, new OrderUnitStudentLastNameSortComparator());
		else if(sort==1) Collections.sort(orders, new OrderUnitStudentGradeSortComparator());
		else if(sort==2) Collections.sort(orders, new OrderUnitStudentClassSortComparator());
		try
		{
			wb = new XSSFWorkbook();
			sheet = wb.createSheet("Sheet1");
			
			CellStyle schoolStyle = wb.createCellStyle();
			Font schoolFont = wb.createFont();
			schoolFont.setFontHeightInPoints((short)16);
			schoolFont.setFontName("Calibri");
			schoolFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
			schoolStyle.setFont(schoolFont);
			
			CellStyle headerStyle = wb.createCellStyle();
			Font headerFont = wb.createFont();
			headerFont.setFontHeightInPoints((short)11);
			headerFont.setFontName("Calibri");
			headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
			headerStyle.setFont(headerFont);
			
			CellStyle style = wb.createCellStyle();
			Font font = wb.createFont();
			font.setFontHeightInPoints((short)11);
			font.setFontName("Calibri");
			style.setFont(font);
			
			int i=0;
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(schoolStyle);
			cell.setCellValue(schoolData.schoolName);
			sheet.addMergedRegion(new CellRangeAddress(i,i,0,4));
			i++;
			
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue(schoolData.address);
			sheet.addMergedRegion(new CellRangeAddress(i,i,0,4));
			i++;
			
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue(schoolData.city+", "+schoolData.state+" "+schoolData.zipcode);
			sheet.addMergedRegion(new CellRangeAddress(i,i,0,4));
			i++;
			
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue(schoolData.phone);
			sheet.addMergedRegion(new CellRangeAddress(i,i,0,4));
			i++;
			
			row = sheet.createRow(i);
			i++;
			
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue(schoolData.trecsName+" PICTURE PACKAGES");
			sheet.addMergedRegion(new CellRangeAddress(i,i,0,4));
			i++;
			
			row = sheet.createRow(i);
			i++;
			
			row = sheet.createRow(i);
			cell = row.createCell(0);
			cell.setCellStyle(headerStyle);
			cell.setCellValue("FIRST");
			cell = row.createCell(1);
			cell.setCellStyle(headerStyle);
			cell.setCellValue("LAST");
			cell = row.createCell(2);
			cell.setCellStyle(headerStyle);
			cell.setCellValue("GRADE");
			cell = row.createCell(3);
			cell.setCellStyle(headerStyle);
			cell.setCellValue("HOMEROOM");
			cell = row.createCell(4);
			cell.setCellStyle(headerStyle);
			cell.setCellValue("PACKAGES");
			i++;
			row = sheet.createRow(i);
			
			sheet.createFreezePane(0, 8);
			sheet.setRepeatingRows(CellRangeAddress.valueOf("1:8"));
			
			if(sort==0)
			{
				sheet.setAutobreaks(true);
				for(RenderOrder s:orders)
				{
					addToExcelList(s);
					i++;
					row = sheet.createRow(i);
				}
			}
			else if(sort==1)
			{
				sheet.getPrintSetup().setFitWidth((short)1);
				String grade ="";
				for(RenderOrder s:orders)
				{
						if(!grade.equals(s.grade))
						{
							sheet.setRowBreak(i-1);
							grade = s.grade;
						}
						addToExcelList(s);
						i++;
						row = sheet.createRow(i);
				}
			}
			else if(sort==2)
			{
				sheet.getPrintSetup().setFitWidth((short)1);
				String homeroom ="";
				for(RenderOrder s:orders)
				{
						if(!homeroom.equals(s.homeroom))
						{
							sheet.setRowBreak(i-1);
							homeroom = s.homeroom;
						}
						addToExcelList(s);
						i++;
						row = sheet.createRow(i);
				}
			}
			
			sheet.autoSizeColumn(0);
		    sheet.autoSizeColumn(1);
		    sheet.autoSizeColumn(2);
		    sheet.autoSizeColumn(3);
		    sheet.autoSizeColumn(4);

		    footer = sheet.getFooter();
			footer.setLeft(HSSFFooter.font("Calibri", "Plain")
					+HSSFFooter.fontSize((short)10)+"Thank you for using Island Photography."
							+ "\nIf you have any questions please contact us at info@islandphotography.net or 559-456-1400");
			
			FileOutputStream fileOut = new FileOutputStream(output+"\\Orders.xlsx");
			wb.write(fileOut);
			fileOut.close();
			wb.close();
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error generating report: "+e);}
		
	}
	private void addToExcelList(RenderOrder s)
	{
		row.createCell(0).setCellValue(s.first);
		row.createCell(1).setCellValue(s.last);
		row.createCell(2).setCellValue(s.grade);
		row.createCell(3).setCellValue(s.homeroom);
		row.createCell(4).setCellValue(s.allItems);
	}

	
}
