package photo.software.student;

import java.io.File;

import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexBuilder;
import com.healthmarketscience.jackcess.Table;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateStudentDatabase 
{
	private File file;
	public CreateStudentDatabase(String refNum, String name, String location)
	{
		file = new File(location+"\\Students.accdb");
		try
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			Table table = new TableBuilder("Students")
				.addColumn(new ColumnBuilder("RefNum",DataType.TEXT))
				.addIndex(new IndexBuilder(IndexBuilder.PRIMARY_KEY_NAME).addColumns("RefNum").setPrimaryKey())
				.addColumn(new ColumnBuilder("First",DataType.TEXT))
				.addColumn(new ColumnBuilder("Last",DataType.TEXT))
				.addColumn(new ColumnBuilder("StuID",DataType.TEXT))
				.addColumn(new ColumnBuilder("Grade",DataType.TEXT))
				.addColumn(new ColumnBuilder("Homeroom",DataType.TEXT))
				.addColumn(new ColumnBuilder("Track",DataType.TEXT))
				.addColumn(new ColumnBuilder("Photo",DataType.BOOLEAN))
				.addColumn(new ColumnBuilder("Field1",DataType.TEXT))
				.addColumn(new ColumnBuilder("Field2",DataType.TEXT))
				.addColumn(new ColumnBuilder("Notes", DataType.MEMO))
				.addColumn(new ColumnBuilder("Order1",DataType.TEXT))
				.addColumn(new ColumnBuilder("Order1Pay",DataType.BOOLEAN))
				.addColumn(new ColumnBuilder("Order2",DataType.TEXT))
				.addColumn(new ColumnBuilder("Order2Pay",DataType.BOOLEAN))
				.toTable(db);
			table.addRow(refNum, "TEST CARD", name, "","EXMPT","","",false,"","","NOTES","",false,"",false);
			
	        
	        table = new TableBuilder("Lists")
		        .addColumn(new ColumnBuilder("List",DataType.TEXT))
				.addColumn(new ColumnBuilder("ReferenceNumber",DataType.TEXT))
	             .toTable(db);
			
			db.close();
		}catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "New Student.accdb FAILED: "+e);
		}
	}
}
