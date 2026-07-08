package photo.software.login;

import java.io.File;

import javax.swing.JOptionPane;

import com.healthmarketscience.jackcess.ColumnBuilder;
import com.healthmarketscience.jackcess.DataType;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.TableBuilder;

public class CreateProgramData 
{
	private File file;
	public CreateProgramData()
	{
		file = new File("ProgramData.accdb");
		if(!file.exists()) createNewProgramData();
		else
		{
			int overwrite = JOptionPane.showOptionDialog(null, "Do you want to overwrite the current ProgramData?", "ARE YOU CRAZY?", 
					JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, null, null);
			if(overwrite == JOptionPane.YES_OPTION)
			{
				boolean success = file.renameTo(new File("BackupProgramData.accdb"));
				if(success) JOptionPane.showMessageDialog(null, "Old ProgramData.accdb was backed up just incase.");
				else JOptionPane.showMessageDialog(null, "Old ProgramData.accdb was not backed up"
						+ "\nYou best know what you be doing.");
				createNewProgramData();
			}
			else new LoginGUIv7();
			
		}
	}
	private void createNewProgramData()
	{
		file = new File("ProgramData.accdb");
		try 
		{
			Database db = new DatabaseBuilder(file).setFileFormat(Database.FileFormat.V2010).create();
			new TableBuilder("Jobs")
					.addColumn(new ColumnBuilder("ID", DataType.TEXT))
					.addColumn(new ColumnBuilder("ReferenceNumber", DataType.TEXT))
					.addColumn(new ColumnBuilder("Location", DataType.TEXT))
					.addColumn(new ColumnBuilder("JobName", DataType.TEXT))
					.addColumn(new ColumnBuilder("Type", DataType.TEXT))
					.addColumn(new ColumnBuilder("PackagePlan", DataType.TEXT))
					.addColumn(new ColumnBuilder("STU_ID", DataType.TEXT))
					.addColumn(new ColumnBuilder("FAC_ID", DataType.TEXT))
					.addColumn(new ColumnBuilder("Notes", DataType.MEMO))
					.toTable(db);
			new TableBuilder("Schools")
					.addColumn(new ColumnBuilder("ReferenceNumber", DataType.TEXT))
					.addColumn(new ColumnBuilder(("SchoolName"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("TrecsName"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Phone"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Address"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("City"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("State"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Zipcode"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact1Name"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact1Position"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact1Email"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact2Name"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact2Position"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact2Email"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact3Name"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact3Position"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Contact3Email"), DataType.TEXT))
					.addColumn(new ColumnBuilder(("Notes"), DataType.TEXT).setMaxLength())
					.toTable(db);
			new TableBuilder("IDtemplate")
					.addColumn(new ColumnBuilder("ID", DataType.INT))
					.addColumn(new ColumnBuilder("Plan", DataType.TEXT))
					.addColumn(new ColumnBuilder("Vertical", DataType.TEXT))
					.addColumn(new ColumnBuilder("ImageX", DataType.TEXT))
					.addColumn(new ColumnBuilder("ImageY", DataType.TEXT))
					.addColumn(new ColumnBuilder("ImageW", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameX", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameY", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameW", DataType.TEXT))
					.addColumn(new ColumnBuilder("FirstX", DataType.TEXT))
					.addColumn(new ColumnBuilder("FirstY", DataType.TEXT))
					.addColumn(new ColumnBuilder("LastX", DataType.TEXT))
					.addColumn(new ColumnBuilder("LastY", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameColor", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameFont", DataType.TEXT))
					.addColumn(new ColumnBuilder("NameSize", DataType.TEXT))
					.addColumn(new ColumnBuilder("BarcodeX", DataType.TEXT))
					.addColumn(new ColumnBuilder("BarcodeY", DataType.TEXT))
					.addColumn(new ColumnBuilder("BarcodeFont", DataType.TEXT))
					.addColumn(new ColumnBuilder("BarcodeSize", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeX", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeY", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeW", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeColor", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeFont", DataType.TEXT))
					.addColumn(new ColumnBuilder("HomeSize", DataType.TEXT))
					.addColumn(new ColumnBuilder("IDNumX", DataType.TEXT))
					.addColumn(new ColumnBuilder("IDNumY", DataType.TEXT))
					.addColumn(new ColumnBuilder("IDNumFont", DataType.TEXT))
					.addColumn(new ColumnBuilder("IDNumSize", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1X", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1Y", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1W", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1Color", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1Font", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra1Size", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2X", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2Y", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2W", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2Color", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2Font", DataType.TEXT))
					.addColumn(new ColumnBuilder("Extra2Size", DataType.TEXT))
					.addColumn(new ColumnBuilder("YearX", DataType.TEXT))
					.addColumn(new ColumnBuilder("YearY", DataType.TEXT))
					.addColumn(new ColumnBuilder("YearColor", DataType.TEXT))
					.addColumn(new ColumnBuilder("qrX", DataType.TEXT))
					.addColumn(new ColumnBuilder("qrY", DataType.TEXT))
					.addColumn(new ColumnBuilder("qrSize", DataType.TEXT))
					.toTable(db);
			new TableBuilder("PackagePlans")
					.addColumn(new ColumnBuilder("PackagePlan", DataType.TEXT))
					.addColumn(new ColumnBuilder("Code", DataType.TEXT))
					.addColumn(new ColumnBuilder("CodeName", DataType.TEXT))
					.addColumn(new ColumnBuilder("f1", DataType.TEXT))
					.addColumn(new ColumnBuilder("f2", DataType.TEXT))
					.addColumn(new ColumnBuilder("f3", DataType.TEXT))
					.addColumn(new ColumnBuilder("f4", DataType.TEXT))
					.addColumn(new ColumnBuilder("f5", DataType.TEXT))
					.addColumn(new ColumnBuilder("f6", DataType.TEXT))
					.addColumn(new ColumnBuilder("f7", DataType.TEXT))
					.addColumn(new ColumnBuilder("f8", DataType.TEXT))
					.addColumn(new ColumnBuilder("f9", DataType.TEXT))
					.addColumn(new ColumnBuilder("f10", DataType.TEXT))
					.addColumn(new ColumnBuilder("f11", DataType.TEXT))
					.addColumn(new ColumnBuilder("f12", DataType.TEXT))
					.addColumn(new ColumnBuilder("f13", DataType.TEXT))
					.addColumn(new ColumnBuilder("f14", DataType.TEXT))
					.addColumn(new ColumnBuilder("f15", DataType.TEXT))
					.toTable(db);
					
			new File("TrecsHotFolder").mkdir();
			db.close();
		}
		catch (Exception e) 
		{
			JOptionPane.showMessageDialog(null, "New ProgramData.accdb FAILED: "+e);
			new LoginGUIv7();
		}
		JOptionPane.showMessageDialog(null, "Success!");
		new LoginGUIv7();
			
	}

}
