package photo.software.student;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.login.SchoolData;

public class ExportStudentsForCertificates 
{

	private ArrayList<Student> students;
	private SchoolData schoolData;
	public ExportStudentsForCertificates(ArrayList<Student> students, SchoolData schoolData)
	{
		this.students = students;
		this.schoolData = schoolData;
		startExport();
	}
	private void startExport()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		fc.setDialogTitle("Specify the folder you would like the data saved.");
		
		int val = fc.showOpenDialog(null);
		if(val==JFileChooser.APPROVE_OPTION)
		{
			try
			{
				PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(fc.getSelectedFile()+"\\"+schoolData.schoolName+".csv")));
				for(Student s: students)
				{
					if((!s.first.equals(""))&&(!s.last.equals("")))
					{
						writer.println(s.ref+","+s.first+","+s.last+","+s.ID+","+s.grade+","+s.homeroom+","+s.photo);
					}
				}
				writer.close();
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error writing: "+e.getMessage());}
		}
	}
}
