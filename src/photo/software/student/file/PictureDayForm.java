package photo.software.student.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;

import javax.swing.JOptionPane;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.student.Student;

public class PictureDayForm 
{
	@SuppressWarnings("unused")
	private ArrayList<Student> renderList;
	private String schoolName, field1, field2, field3, outputPath;
	private int staff = 0, students = 0, blank = 0;
	
	public PictureDayForm(ArrayList<Student> renderList, String schoolName, 
			String field1, String field2, String field3, String outputPath)
	{
		this.renderList = renderList;
		this.schoolName = schoolName;
		this.field1 = field1;
		this.field2 = field2;
		this.field3 = field3;
		this.outputPath = outputPath;
		for(Student s:renderList)
		{
			if(s.grade.equals("FAC")) staff++;
			else if(s.grade.equals("")) blank++;
			else students++;
		}
		
		File form = new File("Templates\\PictureDayForm.xlsx");
		renderXLSX(form);
		
	}
	public void renderXLSX(File form)
	{
		try
		{
			XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(form));
			Sheet sheet = wb.getSheetAt(0);
			Row row = sheet.getRow(1);
			row.createCell(0).setCellValue(schoolName);
			row = sheet.getRow(14);
			if(!field2.equals("")) field2+=": ";
			row.createCell(0).setCellValue("CAMERA CARDS for: "+field1+": "+field2+field3);
			row = sheet.getRow(15);
			row.createCell(0).setCellValue("Students: "+students+",  Staff: "+staff+",  Blank: "+blank);
			FileOutputStream fileOut = new FileOutputStream(outputPath+"\\"+schoolName+"_ProductionForm.xlsx");
			wb.write(fileOut);
			wb.close();
			fileOut.close();
			
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);e.printStackTrace();};
	}
}
