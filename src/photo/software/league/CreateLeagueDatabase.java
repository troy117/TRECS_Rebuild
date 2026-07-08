package photo.software.league;

import java.io.File;

import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexBuilder;
import com.healthmarketscience.jackcess.Table;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateLeagueDatabase 
{
	private File file;
	public CreateLeagueDatabase(String refNum, String name, String location)
	{
		file = new File(location+"\\League.accdb");
		try
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			Table table = new TableBuilder("Players")
			.addColumn(new ColumnBuilder("RefNum",DataType.TEXT))
			.addIndex(new IndexBuilder(IndexBuilder.PRIMARY_KEY_NAME).addColumns("RefNum").setPrimaryKey())
			.addColumn(new ColumnBuilder("Image",DataType.TEXT))
			.addColumn(new ColumnBuilder("Name1",DataType.TEXT))
			.addColumn(new ColumnBuilder("Name2",DataType.TEXT))
			.addColumn(new ColumnBuilder("Team",DataType.TEXT))
			.addColumn(new ColumnBuilder("Order",DataType.TEXT))
			.toTable(db);
			table.addRow(refNum, "BLANK", name, "TEST CARD","","");
			db.close();
		}catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "New League.accdb FAILED: "+e);
		}
	}
}
