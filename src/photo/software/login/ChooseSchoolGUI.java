package photo.software.login;

import javax.swing.JInternalFrame;
import javax.swing.JButton;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import net.miginfocom.swing.MigLayout;

import javax.swing.JComponent;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JComboBox;
import javax.swing.KeyStroke;
import javax.swing.ScrollPaneConstants;

import java.awt.Font;
import java.awt.Toolkit;

import javax.swing.JTable;
import javax.swing.JScrollPane;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultStyledDocument;

import java.awt.Dimension;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Scanner;

import javax.swing.JTextPane;

import photo.software.QRevent.QREventGUI;
import photo.software.QRevent.QRstudents;
import photo.software.event.EventGUI;
import photo.software.event.EventStudents;
import photo.software.league.LeagueGUI;
import photo.software.league.LeaguePlayers;
import photo.software.onsite.LoadOnsiteSetup;
import photo.software.senior.SeniorGUI;
import photo.software.senior.Seniors;
import photo.software.spring.SpringGUI;
import photo.software.spring.SpringStudents;
import photo.software.student.StudentGUI;
import photo.software.student.Students;

@SuppressWarnings("serial")
public class ChooseSchoolGUI extends JInternalFrame implements ActionListener
{
	
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox, comboBox_1;
	private JMenuItem mntmAddNewJob, mntmLoadOnsiteSetup;
	private JButton btnLoadJob;
	private JTextPane textPane;
	
	//All Variable for the Table
	private JPanel panel;
	private JScrollPane scrollPane;
	private JTable table;
	private DefaultTableModel model;
	private String[][] tableArray=null;
	private String[] tableHeader = {"School", "Job", "Type"};
	
	
	private DesktopWindow window;
	JobData selection = null;
	private ArrayList<JobData> jobs, list;
	private ArrayList<String> locations;
	private JScrollPane scrollPane_1;
	private JMenuItem mntmRenderBatchOrders;
	private JMenuItem mntmExportStudentInfo;
	private JMenuItem mntmLoadOnlineOrders;

	public ChooseSchoolGUI(DesktopWindow window) 
	{
		this.window = window;
		jobs = window.programData.getJobs();
		locations = new ArrayList<String>();
		locations.add("");
		for(SchoolData school:window.programData.getSchools()) locations.add(school.trecsName);

		initialize();

	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void initialize()
	{
		setBounds(100, 100, 858, 560);
		
		getContentPane().setLayout(new MigLayout("", "[80.00][][grow]", "[][][][][312.00,grow][]"));
		
		JLabel lblTroysRidiculouslyEfficient = new JLabel("Troy's Ridiculously Efficient Capture Software!");
		lblTroysRidiculouslyEfficient.setFont(new Font("Tahoma", Font.PLAIN, 20));
		getContentPane().add(lblTroysRidiculouslyEfficient, "cell 0 0 2 1,alignx center");
		
		JLabel lblChooseSchool = new JLabel("Choose Location");
		lblChooseSchool.setFont(new Font("Tahoma", Font.PLAIN, 18));
		getContentPane().add(lblChooseSchool, "cell 0 1 2 1,alignx center");
		
		JLabel lblSchool = new JLabel("School:");
		lblSchool.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblSchool, "cell 0 2,alignx trailing");
		
		comboBox = new JComboBox();
		for(String l:locations) comboBox.addItem(l);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		comboBox.addActionListener(this);
		getContentPane().add(comboBox, "cell 1 2,growx");
		
		JLabel lblType = new JLabel("Type:");
		lblType.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblType, "cell 0 3,alignx trailing");
		
		comboBox_1 = new JComboBox();
		comboBox_1.addItem("");
		comboBox_1.addItem("EVENT");
		comboBox_1.addItem("FALL");
		comboBox_1.addItem("FREE");
		comboBox_1.addItem("SPRING");
		comboBox_1.addItem("SPORTS");
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		comboBox_1.addActionListener(this);
		getContentPane().add(comboBox_1, "cell 1 3,growx");
		
		JLabel lblNotes = new JLabel("Notes:");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 18));
		getContentPane().add(lblNotes, "cell 2 3,alignx center");
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 0 4 2 1,grow");
		
		scrollPane = new JScrollPane();
		panel.add(scrollPane);
		
		model = new DefaultTableModel(tableArray, tableHeader)
		{
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		
		table = new JTable(model);
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if(e.getKeyCode()==KeyEvent.VK_DOWN&&table.getSelectedRow()!=-1)
				{
					if(table.getSelectedRow()+1<table.getRowCount())jobSelection(table.getSelectedRow()+1);
					else jobSelection(table.getRowCount()-1);
				}
				else if(e.getKeyCode()==KeyEvent.VK_UP&&table.getSelectedRow()!=-1)
				{
					if(table.getSelectedRow()-1>=0)jobSelection(table.getSelectedRow()-1);
					else jobSelection(0);
				}
				if(e.getKeyCode()==KeyEvent.VK_ENTER&&table.getSelectedRow()!=-1)
				{
					openJob();
				}
			}
		});
		table.addMouseListener(new MouseListener(){

			@Override
			public void mouseClicked(MouseEvent arg0) 
			{
				jobSelection(table.getSelectedRow());
				if(arg0.getClickCount()==2)
				{
					openJob();
				}
			}

			@Override
			public void mouseEntered(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseExited(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mousePressed(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseReleased(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
		});
		table.setPreferredScrollableViewportSize(new Dimension(600, 300));
		scrollPane.setViewportView(table);
		
		scrollPane_1 = new JScrollPane();
		scrollPane_1.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		getContentPane().add(scrollPane_1, "cell 2 4,grow");
		
		textPane = new JTextPane(new DefaultStyledDocument(){
			public void insertString(int offs, String str, AttributeSet a) throws BadLocationException
			{
				if((getLength() + str.length()) <= 255) {super.insertString(offs, str, a);}
			    else Toolkit.getDefaultToolkit().beep();
			}
		});
		scrollPane_1.setViewportView(textPane);
		
		btnLoadJob = new JButton("Load Job");
		btnLoadJob.addActionListener(this);
		btnLoadJob.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnLoadJob, "cell 0 5 2 1,growx");
		
		JMenuBar menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mntmAddNewJob = new JMenuItem("Add New Job");
		mntmAddNewJob.addActionListener(this);
		menuBar.add(mntmAddNewJob);
		
		
		mntmLoadOnsiteSetup = new JMenuItem("Load Onsite Setup");
		mntmLoadOnsiteSetup.addActionListener(this);
		menuBar.add(mntmLoadOnsiteSetup);
		
		mntmRenderBatchOrders = new JMenuItem("Render Batch Orders");
		mntmRenderBatchOrders.addActionListener(this);
		menuBar.add(mntmRenderBatchOrders);
		
		mntmExportStudentInfo = new JMenuItem("Export Student Info");
		mntmExportStudentInfo.addActionListener(this);
		menuBar.add(mntmExportStudentInfo);
		
		mntmLoadOnlineOrders = new JMenuItem("Load Online Orders");
		mntmLoadOnlineOrders.addActionListener(this);
		menuBar.add(mntmLoadOnlineOrders);
		
		redrawTable();
		this.setVisible(true);
	}

	private void jobSelection(int row)
	{
		if(selection!=null&&textPane!=null)
		{
			if(!selection.notes.equals(textPane.getText()))
			{
				selection.notes = textPane.getText();
				if(!window.programData.saveJob(selection)) JOptionPane.showMessageDialog(null, "Failed to Save Notes");
			}
			
			for(JobData j:jobs)
			{
				if(j.refNum.equals(selection.refNum)) 
				{
					j=selection;
					break;
				}
			}
		}
		selection = list.get(row);
		textPane.setText(selection.notes);
	}
	public void redrawTable()
	{
		getJobArray();
		model = new DefaultTableModel(tableArray, tableHeader)
		{
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table = new JTable(model);
		table.setFont(new Font("Tahoma", Font.PLAIN, 12));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if(e.getKeyCode()==KeyEvent.VK_DOWN&&table.getSelectedRow()!=-1)
				{
					if(table.getSelectedRow()+1<table.getRowCount())jobSelection(table.getSelectedRow()+1);
					else jobSelection(table.getRowCount()-1);
				}
				else if(e.getKeyCode()==KeyEvent.VK_UP&&table.getSelectedRow()!=-1)
				{
					if(table.getSelectedRow()-1>=0)jobSelection(table.getSelectedRow()-1);
					else jobSelection(0);
				}
				if(e.getKeyCode()==KeyEvent.VK_ENTER&&table.getSelectedRow()!=-1)
				{
					openJob();
				}
			}
		});
		table.addMouseListener(new MouseListener(){

			@Override
			public void mouseClicked(MouseEvent arg0) 
			{
				jobSelection(table.getSelectedRow());
				if(arg0.getClickCount()==2)
				{
					openJob();
				}
			}

			@Override
			public void mouseEntered(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseExited(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mousePressed(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseReleased(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
		});
		table.setPreferredScrollableViewportSize(new Dimension(600, 300));
		scrollPane.setViewportView(table);
		panel.removeAll();
		scrollPane = new JScrollPane(table);
		panel.add(scrollPane);
		panel.updateUI();
		
		if(selection!=null)
		{
			if(!selection.notes.equals(textPane.getText()))
			{
				selection.notes = textPane.getText();
				if(!window.programData.saveJob(selection)) JOptionPane.showMessageDialog(null, "Failed to Save Notes");
			}
			selection=null;
			textPane.setText("");
		}
		
	}
	private boolean alreadyOpen(JobData job)
	{
		File alreadyOpen = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\CurrentlyOpen.txt");
		if(alreadyOpen.exists())
		{
			String computerName = "Unknown";
			try {
				Scanner sc = new Scanner(alreadyOpen);
				if(sc.hasNextLine()) computerName = sc.nextLine();
				sc.close();
			} catch (FileNotFoundException e) {}
			JOptionPane.showMessageDialog(null, "This job is currently open on "+computerName+".");
			return true;
		}
		String hostname = "Unknown";
		try
		{
		    InetAddress addr;
		    addr = InetAddress.getLocalHost();
		    hostname = addr.getHostName();
		}
		catch (UnknownHostException ex){}

		try {
			PrintWriter p = new PrintWriter(alreadyOpen);
			p.write(hostname+" "+new SimpleDateFormat("MM_dd_HH_mm").format(Calendar.getInstance().getTime()));
			p.close();
		} catch (FileNotFoundException e1) {
			JOptionPane.showMessageDialog(null, "Cannot Find CurrentlyOpen.txt");
		}
		return false;
	}
	private void openJob()
	{
		if(selection.type.equals("FALL")||selection.type.equals("SPORTS"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				Students students = new Students(window,selection);
				if(students.openStudentDatabase())
				{
					StudentGUI stuGUI = new StudentGUI(window,selection,window.programData.getSchoolData(selection.location),students);
					window.add(stuGUI);
					this.dispose();
				}
				else JOptionPane.showMessageDialog(null, "Unable to Open Job");
			}
		}
		else if(selection.type.equals("SENIORS"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				Seniors seniors = new Seniors(window, selection);
				SeniorGUI seniorGUI = new SeniorGUI(window,selection,window.programData.getSchoolData(selection.location),seniors);
				window.add(seniorGUI);
				this.dispose();
			}
			else JOptionPane.showMessageDialog(null, "Unable to Open Job");
		}
		
		else if(selection.type.equals("SPRING"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				SpringStudents spring = new SpringStudents(window,selection);
				if(spring.openStudentDatabase())
				{
					SpringGUI springGUI = new SpringGUI(window,selection,window.programData.getSchoolData(selection.location),spring);
					window.add(springGUI);
					this.dispose();
				}
				else JOptionPane.showMessageDialog(null, "Unable to Open Job");
			}
		}
		else if(selection.type.equals("EVENT"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				EventStudents eventStudents = new EventStudents(window,selection);
				if(eventStudents.openStudentDatabase())
				{
					window.add(new EventGUI(window,selection,eventStudents));
					this.dispose();
				}
			}
		}
		else if(selection.type.equals("QREVENT"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				QRstudents eventStudents = new QRstudents(window,selection);
				if(eventStudents.openStudentDatabase())
				{
					window.add(new QREventGUI(window,selection,eventStudents));
					this.dispose();
				}
			}
		}
		else if(selection.type.equals("LEAGUE"))
		{
			if(!alreadyOpen(selection))
			{
				window.currentJob = selection;
				LeaguePlayers leaguePlayers = new LeaguePlayers(window,selection);
				if(leaguePlayers.openPlayerDatabase())
				{
					window.add(new LeagueGUI(window,selection,leaguePlayers));
					this.dispose();
				}
			}
		}

	}
	private void getJobArray()
	{
		list = new ArrayList<JobData>();
		if(comboBox.getSelectedIndex()==0)
		{
			if(comboBox_1.getSelectedIndex()==0) list.addAll(jobs);
			else for(JobData j:jobs) {if(j.type.equals(comboBox_1.getSelectedItem().toString())) list.add(j);}
		}
		else
		{
			if(comboBox_1.getSelectedIndex()==0) for(JobData j:jobs) {if(j.location.equals(comboBox.getSelectedItem().toString())) list.add(j);}
			else for(JobData j:jobs) {if(j.type.equals(comboBox_1.getSelectedItem().toString())
											&&j.location.equals(comboBox.getSelectedItem().toString())) list.add(j);}
		}
		tableArray = new String[list.size()][3];
		for(int i=0;i<list.size();i++)
		{
			tableArray[i][0] = list.get(i).location;
			tableArray[i][1] = list.get(i).job;
			tableArray[i][2] = list.get(i).type;
		}
	}
	public void actionPerformed(ActionEvent e) 
	{
		Object pressed = e.getSource();
		if(pressed==comboBox)
		{
			redrawTable();
		}
		else if(pressed==comboBox_1)
		{
			redrawTable();
		}
		else if(pressed==btnLoadJob&&selection!=null)
		{
			openJob();
		}
		else if(pressed==mntmAddNewJob)
		{
			window.createJob();
			this.dispose();
		}
		else if(pressed==mntmLoadOnsiteSetup)
		{
			new LoadOnsiteSetup(window,this);
		}
		else if(pressed==mntmRenderBatchOrders)
		{
			window.add(new BatchOrderGUI(window,jobs));
			this.moveToBack();
		}
		else if(pressed==mntmExportStudentInfo)
		{
			window.add(new StudentExportFileGUI(window, jobs));
			this.moveToBack();
		}
		else if(pressed==mntmLoadOnlineOrders)
		{
			window.add(new OnlineOrdersGUI(window, jobs));
			this.moveToBack();
		}
	
	}

}
