package photo.software.onsite;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;

import javax.swing.JOptionPane;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.student.Student;
import photo.software.student.Students;

public class LegacyEndOfDayChangeImport
{
	private final Students students;
	private final File workbookFile;
	private final DataFormatter formatter;

	public LegacyEndOfDayChangeImport(Students students, File workbookFile)
	{
		this.students = students;
		this.workbookFile = workbookFile;
		this.formatter = new DataFormatter();
	}

	public boolean importChanges()
	{
		ArrayList<Student> newRecords = new ArrayList<Student>();
		ArrayList<Student> changedSubjects = new ArrayList<Student>();
		try
		{
			XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(workbookFile));
			try
			{
				readSubjects(workbook.getSheet("New Record Refs"), newRecords);
				readSubjects(workbook.getSheet("Subject Changes"), changedSubjects);
			}
			finally
			{
				workbook.close();
			}
		}
		catch(Exception error)
		{
			JOptionPane.showMessageDialog(null, "Unable to read Legacy TRECS Import.xlsx: " + error);
			return false;
		}

		String message = "Import " + newRecords.size() + " new record(s) and "
				+ changedSubjects.size() + " changed subject(s) into old TRECS?\n\n"
				+ "New records will keep the exact reference numbers assigned onsite.";
		int confirm = JOptionPane.showConfirmDialog(null, message, "Import New TRECS End of Day", JOptionPane.YES_NO_OPTION);
		if(confirm!=JOptionPane.YES_OPTION) return false;

		int importedNew = 0;
		int importedChanges = 0;
		int skipped = 0;
		for(Student subject:newRecords)
		{
			if(students.importLegacyEndOfDaySubject(subject, true)) importedNew++;
			else skipped++;
		}
		for(Student subject:changedSubjects)
		{
			if(students.importLegacyEndOfDaySubject(subject, false)) importedChanges++;
			else skipped++;
		}

		JOptionPane.showMessageDialog(null, "End of Day subject import complete.\nNew records: " + importedNew
				+ "\nChanged subjects: " + importedChanges + "\nSkipped: " + skipped);
		return skipped==0;
	}

	private void readSubjects(Sheet sheet, ArrayList<Student> output)
	{
		if(sheet==null) return;
		for(int rowIndex=1;rowIndex<=sheet.getLastRowNum();rowIndex++)
		{
			Row row = sheet.getRow(rowIndex);
			if(row==null) continue;
			String ref = value(row,0);
			if(ref.equals("")) continue;
			output.add(new Student(
				ref,
				value(row,2),
				value(row,1),
				value(row,3),
				value(row,4),
				value(row,5),
				value(row,6),
				"false",
				value(row,7),
				value(row,8),
				value(row,9),
				"",
				"false",
				"",
				"false"
			));
		}
	}

	private String value(Row row, int columnIndex)
	{
		Cell cell = row.getCell(columnIndex);
		return cell==null ? "" : formatter.formatCellValue(cell).trim();
	}
}
