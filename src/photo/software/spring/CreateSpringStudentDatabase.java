package photo.software.spring;

import java.io.File;

import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexBuilder;
import com.healthmarketscience.jackcess.Table;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateSpringStudentDatabase 
{
	private File file;
	public CreateSpringStudentDatabase(String refNum, String name, String location, String fallLocation)
	{
		file = new File(location+"\\Spring.accdb");
		try
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			Table table = new TableBuilder("Students")
				.addColumn(new ColumnBuilder("RefNum",DataType.TEXT))
				.addIndex(new IndexBuilder(IndexBuilder.PRIMARY_KEY_NAME).addColumns("RefNum").setPrimaryKey())
				.addColumn(new ColumnBuilder("Image",DataType.TEXT))
				.addColumn(new ColumnBuilder("Last",DataType.TEXT))
				.addColumn(new ColumnBuilder("First",DataType.TEXT))
				.addColumn(new ColumnBuilder("Homeroom",DataType.TEXT))
				.addColumn(new ColumnBuilder("Grade",DataType.TEXT))
				.addColumn(new ColumnBuilder("Order1",DataType.TEXT))
				.addColumn(new ColumnBuilder("Order2",DataType.TEXT))
				.addColumn(new ColumnBuilder("Notes",DataType.MEMO))
				.addColumn(new ColumnBuilder("Text1",DataType.TEXT))
				.addColumn(new ColumnBuilder("Text2",DataType.TEXT))
				.addColumn(new ColumnBuilder("Text3",DataType.TEXT))
				.toTable(db);
			table.addRow(refNum, "BLANK", name, "TEST CARD","","EXMPT","","","","","","");
			
			table = new TableBuilder("FallJob").addColumn(new ColumnBuilder("FallJobPath",DataType.TEXT).setMaxLength()).toTable(db);
			table.addRow(fallLocation);
			
			db.close();
			JOptionPane.showMessageDialog(null, "Success!");
		}catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "New Spring.accdb FAILED: "+e);
		}
	}
}