package photo.software.student.capture;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import javax.swing.JOptionPane;

public class WatchHotFolder extends Thread {
	String schoolPath;
	CaptureGUI gui;
	Path hotFolder;
	int notEmpty = 0;

	private volatile Boolean running = true;
	WatchService watchService = null;

	public WatchHotFolder(CaptureGUI gui) {
		this.gui = gui;
		hotFolder = Paths.get("TrecsHotFolder");
		
        try {
            watchService = FileSystems.getDefault().newWatchService();
            hotFolder.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
        } catch (IOException e) {
            gui.writeLog("Error initializing hot folder watcher: " + e.getMessage());
        }
		
	}

	public void setCaptureGUI(CaptureGUI gui) {
		this.gui = gui;
	}

	
    public void start() {
        new Thread(this::run).start();
    }
    
	public void run() {
		gui.writeLog("NewSchoolCapture\t" + gui.schoolData.schoolName + "\t"
				+ gui.schoolData.refNum);
		try {
			while(running){
				WatchKey watchKey = watchService.take();
				for (WatchEvent<?> event : watchKey.pollEvents()) {
					if (StandardWatchEventKinds.ENTRY_CREATE.equals(event
							.kind())) {
						String fileName = event.context().toString();
						if (fileName.toUpperCase().endsWith(".JPG")) {
							gui.setStatus_PanelColor(false);
							gui.writeLog("CaptureJPG\t" + gui.current.ref
									+ "\t" + fileName);
							fire(fileName);
						}
					}
				}
				running = watchKey.reset();
			}
        } catch (InterruptedException e) {
        	gui.writeLog("Hot folder watcher interrupted: " + e.getMessage());
            Thread.currentThread().interrupt(); // Restore interrupted status
            return;
        } catch (java.nio.file.ClosedWatchServiceException e) {
            // Expected when watchService is closed during shutdown
        	//gui.writeLog("Watch service closed, stopping watcher");
            return;
        } catch (Exception e) {
        	gui.writeLog("Error in hot folder watcher: " + e.getMessage());
        }
	}

	private void fire(String fileName) {
		int count = 0;
		try {
			File cr2 = new File("TrecsHotFolder\\"
					+ fileName.toUpperCase().replace(".JPG", ".CR2"));
			File cr3 = new File("TrecsHotFolder\\"
					+ fileName.toUpperCase().replace(".JPG", ".CR3"));
			while (!(cr2.exists() || cr3.exists()) && count < 15) {
				gui.writeLog(cr2.toString() + " does not exist yet... count: "
						+ count);
				Thread.sleep(500);
				count++;
			}
			if (count == 15)
				gui.writeLog("ERROR LOGGING RAW FILE: " + fileName);
			else {
				if (cr2.exists()) {
					gui.writeLog("CaptureRAW\t" + gui.current.ref + "\t"
							+ cr2.getName());
					if (count != 0)
						gui.writeLog(fileName + " created after "
								+ (count * 2.0) + " seconds.");
					gui.updateCapturedImage(new File("TrecsHotFolder\\"
							+ fileName));
					gui.setStatus_PanelColor(true);
				} else if (cr3.exists()) {
					gui.writeLog("CaptureRAW\t" + gui.current.ref + "\t"
							+ cr3.getName());
					if (count != 0)
						gui.writeLog(fileName + " created after "
								+ (count * 2.0) + " seconds.");
					gui.updateCapturedImage(new File("TrecsHotFolder\\"
							+ fileName));
					gui.setStatus_PanelColor(true);
				}

			}
		} catch (Exception e) {
			gui.writeLog("Exception in fire: " + fileName + ": " + e);
		}
	}

	public void stopRunning() {
		running = false;
		try {
			gui.writeLog("CloseSchoolCapture\t" + gui.schoolData.schoolName
					+ "\t" + gui.schoolData.refNum);
			if(watchService != null)
			{
				watchService.close();
			}
		} catch (Exception e) {
			JOptionPane
					.showMessageDialog(
							null,
							"StopRun: "
									+ e
									+ "\nThread may still be running in background monitoring TrecsHotFolder. "
									+ "\nIf it is, close program CtrlAltDelete and stop Java*32 Application");
		}
	}

}

class LinkImages {
	String jpg, cr;

	public LinkImages(String name) {
		if (name.toUpperCase().endsWith(".JPG"))
			jpg = name;
		else if (name.toUpperCase().endsWith(".CR2")||name.toUpperCase().endsWith(".CR3"))
			cr = name;
	}
}


