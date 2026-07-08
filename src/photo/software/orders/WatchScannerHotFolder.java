package photo.software.orders;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.ClosedWatchServiceException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.Arrays;

import javax.swing.JOptionPane;


public class WatchScannerHotFolder extends Thread
{
	String schoolPath;
	DataEntryGUI gui;
	Path hotFolder;
	
	Boolean valid = true, pause = false;
	WatchService watchService = null;
	
	public WatchScannerHotFolder(String schoolPath, DataEntryGUI gui, String hotFolderName)
	{
		this.schoolPath = schoolPath;
		this.gui = gui;
		
		hotFolder = Paths.get(hotFolderName);
	}
	public void setCaptureGUI(DataEntryGUI gui)
	{
		this.gui = gui;
	}
	public boolean emptyHotFolder()
	{
		File[] images = hotFolder.toFile().listFiles(new FilenameFilter() {
		    public boolean accept(File dir, String name) {
		        return name.toLowerCase().endsWith(".jpg");
		    }});
		if(images.length==0) return true;
		else
		{
			Arrays.sort(images);
			new DataEntryScan(schoolPath,images[0].getName(),gui,gui.scanFolder);
		}
		return false;
	}
	public void run()
	{
		try
		{	
			watchService = FileSystems.getDefault().newWatchService();
		    hotFolder.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
		    do 
		    {
		    	if(Thread.currentThread().isInterrupted()) return;
		    	WatchKey watchKey = watchService.take();
		    	for(WatchEvent<?> event : watchKey.pollEvents())
		    	{
		    		if (StandardWatchEventKinds.ENTRY_CREATE.equals(event.kind())) 
		    		{
		    			String fileName = event.context().toString();
		    			if(fileName.endsWith(".jpg")||fileName.endsWith(".JPG"))
		    			{
		    				new DataEntryScan(schoolPath,fileName,gui,gui.scanFolder);	
		    			}
		    		}
		    	}
		      valid = watchKey.reset();
		    } while (valid);
		}
		catch(IOException|InterruptedException e){JOptionPane.showMessageDialog(null, "ERROR in WatchDir!");}
		catch (ClosedWatchServiceException e){}
		catch (Exception e){JOptionPane.showMessageDialog(null, "Exception in Watch: "+e);}
	}
	public void stopRunning()
	{
		try {
			watchService.close();
		} catch (Exception e) {JOptionPane.showMessageDialog(null,"StopRun: "+e 
				+"\nThread may still be running in background monitoring TrecsHotFolder. "
				+ "\nIf it is, close program CtrlAltDelete and stop Java*32 Application");}
	}
	
}
