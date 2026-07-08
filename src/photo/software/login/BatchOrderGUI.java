package photo.software.login;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;
import javax.swing.JTextField;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;

import photo.software.admin.HomeroomCount;
import photo.software.comparators.PackageSortComparator;
import photo.software.orders.plans.PackagePlan;
import photo.software.render.RenderOrder;
import photo.software.student.Student;
import photo.software.student.Students;

@SuppressWarnings("serial")
public class BatchOrderGUI extends JInternalFrame implements ActionListener
{
	private JTextField textField, txtFall;
	private JComboBox<String> comboBox;
	private JButton btnCalculateBatch, btnRender;
	private ArrayList<JobData> batchJobs,allJobs;
	private DesktopWindow window;
	private ArrayList<BatchUnit> batchUnits;
	private Thread renderThread = null;
	private JProgressBar progressBar;
	private JLabel lblCurrent;
	private JButton btnHomeroomCountBatch;
	public BatchOrderGUI(DesktopWindow window,ArrayList<JobData> allJobs) 
	{
		this.window = window;
		this.allJobs = allJobs;
		initialize();
	}
	private void calculateBatch()
	{
		Students tempStudents;
		
		batchJobs = new ArrayList<JobData>();
		for(JobData j:allJobs)
		{
			if(j.job.equals(txtFall.getText()))
			{
				batchJobs.add(j);
			}
		}
		batchUnits = new ArrayList<BatchUnit>();
		for(JobData j:batchJobs)
		{
			
			tempStudents = new Students(window,j);
			tempStudents.openStudentDatabase();
			tempStudents.loadListDatabase();
			for(Student s:tempStudents.getStudentsFromList(textField.getText()))
			{
				batchUnits.add(new BatchUnit(j,s));
			}
			tempStudents.close();
		}
		String temp="";
		int count=0;
		for(BatchUnit b:batchUnits)
		{
			if(!temp.equals(b.job.location))
			{
				count++;
				temp = b.job.location;
			}
		}
		JOptionPane.showMessageDialog(null, "There are "+batchUnits.size()+" Orders from "+count+" different schools.");
	}
	private void homeroomCounts()
	{
		Students tempStudents;
		batchJobs = new ArrayList<JobData>();
		for(JobData j:allJobs)
		{
			if(j.job.equals(txtFall.getText()))
			{
				batchJobs.add(j);
			}
		}
		for(JobData j:batchJobs)
		{
			tempStudents = new Students(window,j);
			tempStudents.openStudentDatabase();
			new HomeroomCount(tempStudents.getStudents(),j.location,System.getProperty("user.dir"));
			tempStudents.close();
		}
	}
	public void updateProgressBar(int precent, String text)
	{
		progressBar.setValue(precent);
		lblCurrent.setText(text);
	}
	private void renderUnits()
	{
		ProgramData program = new ProgramData(window);
		program.openPackagePlans();
		ArrayList<PackagePlan> plans = program.getPackagePlans();
		Collections.sort(plans, new PackageSortComparator());
		program.close();
		
		JFileChooser chooser = new JFileChooser();
		chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = chooser.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			ArrayList<RenderOrder> allOrders = new ArrayList<RenderOrder>();
			for(BatchUnit b:batchUnits)
			{
				if((b.student.order1Pay.equals("true"))&&(!b.student.order1.equals("")))
					allOrders.add(new RenderOrder(b.student.ref, b.student.ref+".jpg","CroppedLarge", b.job.plan, b.student.order1,
						window.jobs+"\\"+b.job.location+"\\"+b.job.job, 
						b.student.first, b.student.last, b.student.homeroom, b.student.grade,b.job.location,0));
			}
			JOptionPane.showMessageDialog(null, "THIS FUNCTION DOES NOT WORK ANYMORE!  ");
			/*RenderOrders rend = new RenderOrders(null, "FALL", allOrders, plans, null, 
					null, this, renderPath, 0, true, true, true, textField.getText(),true,false,false);
			renderThread = new Thread(rend);
			renderThread.start();*/
			
		}
	}
	private void initialize()
	{
		setBounds(100, 100, 450, 338);
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][][][][][][]"));
		
		JLabel lblBatchOrderProcessor = new JLabel("Batch Order Processor");
		lblBatchOrderProcessor.setFont(new Font("Tahoma", Font.BOLD, 18));
		getContentPane().add(lblBatchOrderProcessor, "cell 0 0 2 1,alignx center");
		
		JLabel lblJobNameMatches = new JLabel("Job Name Matches:");
		lblJobNameMatches.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblJobNameMatches, "cell 0 1");
		
		txtFall = new JTextField();
		txtFall.setText("FALL_2025");
		txtFall.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(txtFall, "cell 1 1,growx");
		txtFall.setColumns(10);
		
		btnHomeroomCountBatch = new JButton("Homeroom Count Batch");
		btnHomeroomCountBatch.addActionListener(this);
		btnHomeroomCountBatch.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnHomeroomCountBatch, "cell 1 2,growx");
		
		JLabel lblListNameMatches = new JLabel("List Name Matches:");
		lblListNameMatches.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblListNameMatches, "cell 0 3,alignx trailing");
		
		textField = new JTextField();
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField, "cell 1 3,growx");
		textField.setColumns(10);
		
		btnCalculateBatch = new JButton("Calculate Batch");
		btnCalculateBatch.addActionListener(this);
		btnCalculateBatch.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnCalculateBatch, "cell 1 4,growx");
		
		JLabel lblSortBy = new JLabel("Sort By:");
		lblSortBy.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblSortBy, "cell 0 6,alignx trailing");
		
		comboBox = new JComboBox<String>();
		comboBox.setModel(new DefaultComboBoxModel<String>(new String[] {"Last"}));
		comboBox.setSelectedIndex(0);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox, "cell 1 6,growx");
		
		btnRender = new JButton("Render");
		btnRender.addActionListener(this);
		btnRender.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnRender, "cell 1 7,growx");
		
		progressBar = new JProgressBar();
		getContentPane().add(progressBar, "cell 1 8,growx");
		
		lblCurrent = new JLabel("Current:");
		getContentPane().add(lblCurrent, "cell 1 9");
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameActivated(InternalFrameEvent arg0) {}
			public void internalFrameClosed(InternalFrameEvent arg0) {}
			public void internalFrameClosing(InternalFrameEvent arg0) {close();}
			public void internalFrameDeactivated(InternalFrameEvent arg0) {}
			public void internalFrameDeiconified(InternalFrameEvent arg0) {}
			public void internalFrameIconified(InternalFrameEvent arg0) {}
			public void internalFrameOpened(InternalFrameEvent arg0) {}
		});
	}

	private void close()
	{
		this.dispose();
		try{renderThread.interrupt();}catch(Exception e){}
		renderThread = null;
	}
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnCalculateBatch)
		{
			calculateBatch();
		}
		else if(pressed==btnRender)
		{
			renderUnits();
		}
		else if(pressed==btnHomeroomCountBatch)
		{
			homeroomCounts();
		}
	}

}
class BatchUnit{
	public JobData job;
	public Student student;
	public BatchUnit(JobData job, Student student)
	{
		this.job = job;
		this.student = student;
	}
}
