package photo.software.orders;
import java.io.File;

import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

public class DataEntryScan 
{

	private String hotImage, referenceNumber, movedImage, scannerFolder;
	private DataEntryGUI gui;
	
	public DataEntryScan(String schoolPath, String image, DataEntryGUI gui, String scannerFolder)
	{
		referenceNumber = gui.current.ref;
		this.hotImage = image;
		this.gui = gui;
		this.scannerFolder = scannerFolder;
		movedImage = schoolPath+"\\Envelopes\\"+referenceNumber+"_"+hotImage;
		move();
	}
	private void move()
	{
		File hotFile = new File(scannerFolder+"\\"+hotImage);
		File movedFile = new File(movedImage);
		try
		{
			FileUtils.moveFile(hotFile, movedFile);
			gui.updateEnvelope(movedFile);
		}catch(Exception e)
		{
			try{
				Thread.sleep(1000);
				if(hotFile.exists())
				{
					FileUtils.moveFile(hotFile, movedFile);
					gui.updateEnvelope(movedFile);
				}
			}catch(Exception e1)
			{
				try
				{
					Thread.sleep(2000);
					if(hotFile.exists())
					{
						FileUtils.moveFile(hotFile, movedFile);
						gui.updateEnvelope(movedFile);
					}
					
				}
				catch(Exception e2){JOptionPane.showMessageDialog(null, "Unable to move image: "+hotImage+" to "+movedFile.getName());}
			}
		}
	}
	
}
