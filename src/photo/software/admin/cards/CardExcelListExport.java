package photo.software.admin.cards;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;

public class CardExcelListExport 
{
	private ArrayList<Student> cardList;
	private ArrayList<Homeroom> homerooms;
	private String outputPath, schoolName;
	
	public CardExcelListExport(ArrayList<Student> cardList,String outputPath,String schoolName)
	{
		this.cardList = cardList;
		this.outputPath = outputPath;
		this.schoolName = schoolName;
		prepHomeroom();
		writeOutputFile();
	}
	private void prepHomeroom()
	{
		homerooms = new ArrayList<Homeroom>();
		Collections.sort(cardList, new StudentClassSortComparator());
		
		for(Student s:cardList)
		{
			if((!s.homeroom.equals(""))
					&&(!s.last.equals(""))
					&&(!s.first.equals(""))
					&&(!s.grade.equals("EXMPT"))
					&&(s.photo.toUpperCase().equals("TRUE"))) addToHomeroom(s);
		}
	}
	private void addToHomeroom(Student s)
	{
		Boolean exists = false;
		for(Homeroom h: homerooms)
		{
			if(h.getHomeroom().equals(s.homeroom))
			{
				exists = true;
				h.addStudent(s);
				return;
			}
		}if(!exists)
		{
			homerooms.add(new Homeroom(s.homeroom));
			for(Homeroom h:homerooms)
			{
				if(h.getHomeroom().equals(s.homeroom)) h.addStudent(s);
			}
		}
	}
	private void writeOutputFile()
	{
		Workbook wb;
		Sheet sheet;
		Row row;
		try
		{
			wb = new XSSFWorkbook();
			sheet = wb.createSheet("Homeroom");
			int i=0;
			row = sheet.createRow(i);
			row.createCell(0).setCellValue("Homeroom");
			row.createCell(1).setCellValue("Grade");
			row.createCell(2).setCellValue("Students");
			row.createCell(3).setCellValue("Purchased");
			row.createCell(4).setCellValue("Returned");
			row.createCell(5).setCellValue("Missing");
			i++;
			row = sheet.createRow(i);
			for(Homeroom h:homerooms)
			{
				row.createCell(0).setCellValue(h.getHomeroom());
				row.createCell(1).setCellValue(h.getGrades());
				row.createCell(2).setCellValue(h.totalSize());
				i++;
				row = sheet.createRow(i);
			}
			FileOutputStream fileOut = new FileOutputStream(outputPath+"\\"+schoolName+".xlsx");
			wb.write(fileOut);
			fileOut.close();
			wb.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error creating Card Excel List: "+e);}
	}	
}
