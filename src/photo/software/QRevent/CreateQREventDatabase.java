package photo.software.QRevent;

import java.io.File;

import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexBuilder;
import com.healthmarketscience.jackcess.Table;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateQREventDatabase 
{
	private File file;
	public CreateQREventDatabase(String refNum, String name, String location, String fallLocation, String websitePrefix)
	{
		file = new File(location+"\\QREvents.accdb");
		try
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			Table table = new TableBuilder("Students")
			.addColumn(new ColumnBuilder("RefNum",DataType.TEXT))
			.addIndex(new IndexBuilder(IndexBuilder.PRIMARY_KEY_NAME).addColumns("RefNum").setPrimaryKey())
			.addColumn(new ColumnBuilder("Image",DataType.TEXT))
			.addColumn(new ColumnBuilder("First",DataType.TEXT))
			.addColumn(new ColumnBuilder("Last",DataType.TEXT))
			.addColumn(new ColumnBuilder("Homeroom",DataType.TEXT))
			.addColumn(new ColumnBuilder("Order",DataType.TEXT))
			.addColumn(new ColumnBuilder("Notes",DataType.MEMO))
			.addColumn(new ColumnBuilder("Rand",DataType.TEXT))
			.toTable(db);
			table.addRow(refNum, "BLANK", name, "TEST CARD","","","");
			
			table = new TableBuilder("FallJob").addColumn(new ColumnBuilder("FallJobPath",DataType.TEXT).setMaxLength()).toTable(db);
			table.addRow(fallLocation);
			
			table = new TableBuilder("Website").addColumn(new ColumnBuilder("WebsitePrefix",DataType.TEXT).setMaxLength()).toTable(db);
			table.addRow(websitePrefix);
			
			db.close();
		}catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "New Events.accdb FAILED: "+e);
		}
	}
}
