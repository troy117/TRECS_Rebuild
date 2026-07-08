package photo.software.login;


import javax.swing.ImageIcon;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JInternalFrame;
import javax.swing.JOptionPane;

import photo.software.event.EventGUI;
import photo.software.orders.DataEntryGUI;
import photo.software.student.StudentGUI;
import photo.software.student.capture.CaptureGUI;

import java.awt.BorderLayout;
import java.awt.Frame;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.File;

public class DesktopWindow {

	private JFrame frame;
	private JDesktopPane desktopPane;
	public ProgramData programData;
	public String jobs;
	JInternalFrame currentGUI = null;
	public String user;
	public JobData currentJob = null;

	public DesktopWindow(String user) 
	{
		this.user = user;
		if(user.contains("Remote"))
		{
			//Location Program Data & JOBS will be for testing purposes once TRECS is up and running
			programData = new ProgramData("T:\\2025-2026 TRECS\\ProgramData.accdb",this);
			programData.openJobs();
			jobs = "T:\\2025-2026 TRECS\\JOBS";
		}
		else
		{
			if(!new File("ProgramData.accdb").exists())
			{
				JOptionPane.showMessageDialog(null, "Software must be initialized first!");
				return;
			}
			programData = new ProgramData(this);
			programData.openJobs();
			jobs = "JOBS";
		}
		
		initialize();
		if(programData.totalJobs()==0) createJob();
		else chooseJob();
		
	}
	/**
	 * Initialize the contents of the frame.
	 */
	@SuppressWarnings("serial")
	private void initialize() {
		frame = new JFrame("Troy's Ridiculously Efficient Capture Software Version 6");
		frame.setIconImage(new ImageIcon(getClass().getClassLoader().getResource("logo.png")).getImage());
		frame.setBounds(0, 0, 1200, 1000);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		frame.addWindowListener(new WindowListener(){

			@Override
			public void windowActivated(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void windowClosed(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void windowClosing(WindowEvent arg0) {
				closeStudentInformation();
				closeJob();
			}

			@Override
			public void windowDeactivated(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void windowDeiconified(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void windowIconified(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void windowOpened(WindowEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
		});
		
		desktopPane = new JDesktopPane()
		{
			ImageIcon icon = new ImageIcon(getClass().getClassLoader().getResource("logo.png"));
			Image image = icon.getImage().getScaledInstance(800, -1, Image.SCALE_SMOOTH);
			
			protected void paintComponent(Graphics g)
			{
				super.paintComponent(g);
				g.drawImage(image, 100, 100, this);
			}
			
		};
		frame.getContentPane().add(desktopPane, BorderLayout.CENTER);
	}
	public void add(JInternalFrame frame)
	{
		currentGUI = frame;
		desktopPane.add(frame);
	}
	public void closeJob()
	{
		if(currentJob!=null)
		{
			File alreadyOpen = new File(jobs+"\\"+currentJob.location+"\\"+currentJob.job+"\\Database\\CurrentlyOpen.txt");
			if(alreadyOpen.exists()) alreadyOpen.delete();
		}
		currentJob = null;
	}
	public Frame getParentFrame() {
	    return frame;
	}
	public void chooseJob()
	{
		closeJob();
		desktopPane.add(new ChooseSchoolGUI(this));
	}
	public void createJob()
	{
		desktopPane.add(new CreateNewJobGUI(this));
	}
	private void closeStudentInformation()
	{
		if(currentGUI!=null & currentGUI instanceof StudentGUI ) ((StudentGUI)currentGUI).close();
		else if(currentGUI!=null & currentGUI instanceof EventGUI ) ((EventGUI)currentGUI).close();
		else if(currentGUI!=null & currentGUI instanceof CaptureGUI) ((CaptureGUI)currentGUI).close();
		else if(currentGUI!=null & currentGUI instanceof DataEntryGUI) ((DataEntryGUI)currentGUI).close();
		frame.dispose();
	}

}
