package photo.software.senior;

import java.io.File;
import java.util.ArrayList;
import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexBuilder;
import com.healthmarketscience.jackcess.Table;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateSeniorDatabase 
{
	private File file;
	public CreateSeniorDatabase(String refNum, String name, String location, ArrayList<Senior> seniors, String fallPath)
	{
		file = new File(location+"\\Seniors.accdb");
		try
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			Table table = new TableBuilder("Students")
				.addColumn(new ColumnBuilder("RefNum",DataType.TEXT))
				.addIndex(new IndexBuilder(IndexBuilder.PRIMARY_KEY_NAME).addColumns("RefNum").setPrimaryKey())
				.addColumn(new ColumnBuilder("First",DataType.TEXT))
				.addColumn(new ColumnBuilder("Last",DataType.TEXT))
				.addColumn(new ColumnBuilder("StuID",DataType.TEXT))
				.addColumn(new ColumnBuilder("Homeroom",DataType.TEXT))
				.addColumn(new ColumnBuilder("Notes", DataType.MEMO))
				.addColumn(new ColumnBuilder("Orders",DataType.MEMO))
				.addColumn(new ColumnBuilder("Code",DataType.TEXT))
				.toTable(db);
	        table = new TableBuilder("Lists")
			        .addColumn(new ColumnBuilder("List",DataType.TEXT))
					.addColumn(new ColumnBuilder("ReferenceNumber",DataType.TEXT))
		             .toTable(db);
			table.addRow(refNum, "TEST CARD", name, "","EXMPT","","","");
			for(Senior s:seniors)
			{
				table.addRow(s.ref,s.first,s.last,s.ID,s.homeroom,s.notes,s.orders,s.code);
			}
			table = new TableBuilder("FallJob").addColumn(new ColumnBuilder("FallJobPath",DataType.TEXT).setMaxLength()).toTable(db);
			table.addRow(fallPath);
			db.close();
		}catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "New Student.accdb FAILED: "+e);
		}
	}
}
