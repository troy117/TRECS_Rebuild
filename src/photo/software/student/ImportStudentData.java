package photo.software.student;

import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.comparators.*;

//Need to work on
public class ImportStudentData 
{
	private String[] rowValues;
	public static final int COLUMN = 8;
	private ArrayList<Student> tempStudentList;
	private ArrayList<String[]> inputData;
	NumberFormat formatter = new DecimalFormat("############");
	
	public ImportStudentData(String fileToLoad)
	{
		if(fileToLoad.substring(fileToLoad.lastIndexOf(".")+1).equals("xls")) XLSImport(fileToLoad);
		else if(fileToLoad.substring(fileToLoad.indexOf(".")+1).equals("xlsx")) XLSXImport(fileToLoad);
		else JOptionPane.showMessageDialog(null, "Error Importing Data, not xls or xlsx");
	}
	public void XLSImport(String fileToLoad)
	{
		inputData=new ArrayList<String[]>();
		try
		{
			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(fileToLoad));
			HSSFSheet sheet = wb.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 0; r < rows; r++) {
				HSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[COLUMN];
				for (int c = 0; c < COLUMN; c++) {
					HSSFCell cell = row.getCell(c);
					
					String value = null;
					try{
						switch (cell.getCellType()) {
							case HSSFCell.CELL_TYPE_FORMULA:
								value = "" + cell.getCellFormula();
								break;
		
							case HSSFCell.CELL_TYPE_NUMERIC:
								value = formatter.format(cell.getNumericCellValue());
								break;
		
							case HSSFCell.CELL_TYPE_STRING:
								value = "" + cell.getStringCellValue().toUpperCase();
								break;
							
							default:
							}
						}
					catch(NullPointerException e){value="";}
					if(value==null)value="";
					rowValues[c]=value.toUpperCase();
				}
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))
						&&(rowValues[2].equals(""))&&(rowValues[3].equals(""))
						&&(rowValues[4].equals(""))&&(rowValues[5].equals(""))
						&&(rowValues[6].equals(""))&&(rowValues[7].equals(""))) 
					{
						break;
					}
				else {
					inputData.add(rowValues);
				}
			}
			wb.close();
		}catch(Exception e){System.out.println("ERROR: "+e);}
	}
	public void XLSXImport(String fileToLoad)
	{
		inputData=new ArrayList<String[]>();
		try
		{
			XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(fileToLoad));
			XSSFSheet sheet = wb.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 0; r < rows; r++) {
				XSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[COLUMN];
				for (int c = 0; c < COLUMN; c++) {
					XSSFCell cell = row.getCell(c);
					
					String value = null;
					try{
						switch (cell.getCellType()) {
							case XSSFCell.CELL_TYPE_FORMULA:
								value = "" + cell.getCellFormula();
								break;
		
							case XSSFCell.CELL_TYPE_NUMERIC:
								value = formatter.format(cell.getNumericCellValue());
								break;
		
							case XSSFCell.CELL_TYPE_STRING:
								value = "" + cell.getStringCellValue().toUpperCase();
								break;
							
							default:
							}
						}
					catch(NullPointerException e){value="";}
					if(value==null)value="";
					rowValues[c]=value.toUpperCase();
				}
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))
						&&(rowValues[2].equals(""))&&(rowValues[3].equals(""))
						&&(rowValues[4].equals(""))&&(rowValues[5].equals(""))
						&&(rowValues[6].equals(""))&&(rowValues[7].equals(""))) 
					{
						break;
					}
				else {
					inputData.add(rowValues);
				}
			}
			wb.close();
		}catch(Exception e){System.out.println("ERROR: "+e);}
	}
	
	public String[][] toArray()
	{
		String[][] information = new String[inputData.size()][8];
		for(int i=0;i<inputData.size();i++)
		{
			for(int j=0;j<8;j++)
			{
				information[i][j]=inputData.get(i)[j];
			}
		}
		return information;
	}
	
	public String[][] table2toArray()
	{
		String[][] information = new String[tempStudentList.size()][8];
		for(int i=0;i<tempStudentList.size();i++)
		{
			information[i][0] = tempStudentList.get(i).last;
			information[i][1] = tempStudentList.get(i).first;
			information[i][2] = tempStudentList.get(i).ID;
			information[i][3] = tempStudentList.get(i).grade;
			information[i][4] = tempStudentList.get(i).homeroom;
			information[i][5] = tempStudentList.get(i).track;
			information[i][6] = tempStudentList.get(i).field1;
			information[i][7] = tempStudentList.get(i).field2;

		}
		return information;
	}
	
	public void setColumnOrder(boolean header, String lastIn, String firstIn, String idIn, String gradeIn,
			String teacherIn, String trackIn, String f1In, String f2In, int sortMethod)
	{
		int start=0;
		if(!header)start++;
		int lastIndex, firstIndex, idIndex, gradeIndex, teacherIndex,trackIndex,field1Index,field2Index;
		String last="", first="", id="", grade="", teacher="", track="", field1="",field2="";
		try{
			lastIndex = Integer.parseInt(lastIn);
		}catch(Exception e){lastIndex = -1;}
		try{
			firstIndex = Integer.parseInt(firstIn);
		}catch(Exception e){firstIndex = -1;}
		try{
			idIndex = Integer.parseInt(idIn);
		}catch(Exception e){idIndex = -1;}
		try{
			gradeIndex = Integer.parseInt(gradeIn);
		}catch(Exception e){gradeIndex = -1;}
		try{
			teacherIndex = Integer.parseInt(teacherIn);
		}catch(Exception e){teacherIndex = -1;}
		try{
			trackIndex = Integer.parseInt(trackIn);
		}catch(Exception e){trackIndex = -1;}
		try{
			field1Index = Integer.parseInt(f1In);
		}catch(Exception e){field1Index = -1;}
		try{
			field2Index = Integer.parseInt(f2In);
		}catch(Exception e){field2Index = -1;}
		
		tempStudentList = new ArrayList<Student>();
		for(int i=start; i<inputData.size();i++)
		{
			
			if(lastIndex!=-1)last = inputData.get(i)[lastIndex-1];
			if(firstIndex!=-1)first = inputData.get(i)[firstIndex-1];
			if(idIndex!=-1)id = inputData.get(i)[idIndex-1];
			if(gradeIndex!=-1)grade = inputData.get(i)[gradeIndex-1];
			if(teacherIndex!=-1)teacher = inputData.get(i)[teacherIndex-1];
			if(trackIndex!=-1)track = inputData.get(i)[trackIndex-1];
			if(field1Index!=-1)field1 = inputData.get(i)[field1Index-1];
			if(field2Index!=-1)field2 = inputData.get(i)[field2Index-1];
			
			Student temp = new Student(last,first,id,grade,teacher,track,field1,field2);
			tempStudentList.add(temp);
		}
		if(sortMethod==0) Collections.sort(tempStudentList,new StudentLastNameSortComparator());
		else if(sortMethod==1) Collections.sort(tempStudentList,new StudentGradeSortComparator());
		else if(sortMethod==2) Collections.sort(tempStudentList,new StudentClassSortComparator());
		else if(sortMethod==3) Collections.sort(tempStudentList,new StudentIDSortComparator());
		else if(sortMethod==4) Collections.sort(tempStudentList,new StudentTrackSortComparator());	
	}
	public ArrayList<Student> getStudentsToAdd()
	{
		return tempStudentList;
	}
	
}
