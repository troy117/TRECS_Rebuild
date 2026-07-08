package photo.software.login;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;

import java.awt.Font;

import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;

import photo.software.student.Student;
import photo.software.student.Students;

@SuppressWarnings("serial")
public class StudentExportFileGUI extends JInternalFrame implements ActionListener{

	private DesktopWindow window;
	private ArrayList<JobData> allJobs;
	private JTextField txtFall;
	private JButton btnCreateCsvExport;
	
	public StudentExportFileGUI(DesktopWindow window,ArrayList<JobData> allJobs) {
		this.window = window;
		this.allJobs = allJobs;
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][]"));
		
		JLabel lblJobNameMatches = new JLabel("Job Name Matches:");
		lblJobNameMatches.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblJobNameMatches, "cell 0 2");
		
		txtFall = new JTextField();
		txtFall.setText("FALL_2025");
		getContentPane().add(txtFall, "cell 1 2,growx");
		txtFall.setColumns(10);
		
		btnCreateCsvExport = new JButton("Create CSV Export");
		btnCreateCsvExport.addActionListener(this);
		getContentPane().add(btnCreateCsvExport, "cell 1 4,growx");
		initialize();
		
		

	}

	private void initialize()
	{
		setBounds(100, 100, 450, 300);
		this.setClosable(true);
		this.setVisible(true);
		
	}
	private void writeCSV()
	{
		Students tempStudents;
		ArrayList<Student> schoolStudents;
		try 
		{
			FileWriter csvWriter = new FileWriter("Student_Export.csv");
			csvWriter.append("School Name,Student Ref,First,Last,Grade,Homeroom,ID,\n");

		
			for(JobData j:allJobs)
			{
				if(j.job.equals(txtFall.getText()))
				{
					tempStudents = new Students(window,j);
					tempStudents.openStudentDatabase();
					schoolStudents = tempStudents.getStudents();
					tempStudents.close();
					for(Student s:schoolStudents)
					{
						if(!s.isBlank())
						{
							csvWriter.append(j.location+","+s.ref+","+s.first+","+s.last+","+s.grade+","+s.homeroom+","+s.ID+"\n");
						}

					}
				}
			}
			JOptionPane.showMessageDialog(null, "All Done! Student_Export.csv file has been created in program folder.");
			csvWriter.flush();
			csvWriter.close();
		
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnCreateCsvExport)
		{
			writeCSV();
		}
	}

}
