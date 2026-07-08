package photo.software.admin;

import java.io.FileOutputStream;
import java.util.ArrayList;

import javax.swing.JOptionPane;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.login.SchoolData;
import photo.software.student.Student;

public class MissingReportGenerator 
{
	Workbook wb;
	Sheet sheet;
	Row row;
	
	public MissingReportGenerator(ArrayList<Student> students, SchoolData schoolData, String outputPath)
	{
		try
		{
			wb = new XSSFWorkbook();
			sheet = wb.createSheet("Sheet1");
			int i=0;
			row = sheet.createRow(i);
			row.createCell(0).setCellValue("REF#");
			row.createCell(1).setCellValue("Last");
			row.createCell(2).setCellValue("First");
			row.createCell(3).setCellValue("Grade");
			row.createCell(4).setCellValue("ID Number");
			row.createCell(5).setCellValue("Homeroom");
			row.createCell(6).setCellValue("Photographed");
			i++;
			row = sheet.createRow(i);
			for(Student s:students)
			{
				if((!s.first.equals(""))&&(!s.last.equals("")))
				{
					if((!s.photo.equals("true"))
						||((!s.grade.equals("FAC"))&&((s.ID.equals(""))||(s.homeroom.equals(""))))
						||(s.grade.equals("")))
					{
						addToExcelList(s);
						i++;
						row = sheet.createRow(i);
					}
				}
			}
			FileOutputStream fileOut = new FileOutputStream(outputPath+"\\"+schoolData.trecsName+"_Photography_Report.xlsx");
			wb.write(fileOut);
			fileOut.close();
			JOptionPane.showMessageDialog(null, "Complete");
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error Generating Photography Report: "+e);}
	}

	
	private void addToExcelList(Student s)
	{
		row.createCell(0).setCellValue(s.ref);
		row.createCell(1).setCellValue(s.last);
		row.createCell(2).setCellValue(s.first);
		if(s.grade.equals("")) row.createCell(3).setCellValue("MISSING");
		else row.createCell(3).setCellValue(s.grade);
		
		if(s.ID.equals("")) row.createCell(4).setCellValue("MISSING");
		else row.createCell(4).setCellValue(s.ID);
		
		if(s.homeroom.equals("")) row.createCell(5).setCellValue("MISSING");
		else row.createCell(5).setCellValue(s.homeroom);
		
		if(s.photo.equals("false")) row.createCell(6).setCellValue("NOT PHOTOGRAPHED");
		else row.createCell(6).setCellValue("Photographed");
	}
}
