package photo.software.orders;
import java.io.File;
import javax.swing.JOptionPane;
import org.apache.commons.io.FileUtils;
import photo.software.spring.SpringDataEntryGUI;

public class SpringDataEntryScan 
{

	private String hotImage, referenceNumber, movedImage;
	private SpringDataEntryGUI gui;
	
	public SpringDataEntryScan(String schoolPath, String image, SpringDataEntryGUI gui)
	{
		referenceNumber = gui.current.ref;
		this.hotImage = image;
		this.gui = gui;
		movedImage = schoolPath+"\\Envelopes\\"+referenceNumber+"_"+hotImage;
		move();
	}
	private void move()
	{
		File hotFile = new File("ScannerFolder1\\"+hotImage);
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
				catch(Exception e2){JOptionPane.showMessageDialog(null, "Unable to move image: "+hotImage+" to "+movedFile.getName()
										+"\nDon't worry.  Transfer from camera is slow... Keep shooting.");}
			}
		}
	}
	
}
