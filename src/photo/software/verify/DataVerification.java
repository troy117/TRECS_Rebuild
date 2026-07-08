package photo.software.verify;

import java.util.ArrayList;
import java.util.Collections;
import java.util.ListIterator;

import javax.swing.JOptionPane;

import photo.software.comparators.StudentIDSortComparator;
import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.student.Student;
import photo.software.student.StudentGUI;
import photo.software.student.Students;


public class DataVerification 
{
	ArrayList<Student> verifyStudents;
	ArrayList<Student> currentStudents;
	ArrayList<Student> updateList;
	ArrayList<Student> compareList;
	String teach;
	Students students;
	ConfirmVerifyGUI verifyGUI;
	Boolean foundStudent;
	Student s, c;
	
	ListIterator<Student> iter;
	
	StudentGUI studentGUI;
	/**
	 * 
	 * Verifies the student data for all except EXMPT, FAC, and blank students
	 * 
	 * 
	 * @param info StudentInformationGUI where the current students ArrayList can be accessed
	 * @param verify the ArrayList of student data to compare with the original info
	 */
	public DataVerification(Students students, ArrayList<Student> verify, StudentGUI studentGUI)
	{
		verifyGUI=null;
		this.students = students;
		this.verifyStudents = verify;
		this.studentGUI = studentGUI;
		currentStudents = students.getStudents();
		updateList = new ArrayList<Student>();
		compareList= new ArrayList<Student>();
		teach = "";
		s=null;
		c=null;
		iter = null;
		foundStudent=false;
		
		idVerify();
		nameVerify();

		if(compareList.size()!=updateList.size()) JOptionPane.showMessageDialog(null, "Error List size! DataVerification class!");
		else buildTables();
	}
	private void idVerify()
	{
		Collections.sort(currentStudents, new StudentIDSortComparator());
		Collections.sort(verifyStudents, new StudentIDSortComparator());

		ListIterator<Student> iter = currentStudents.listIterator();

		while(iter.hasNext())
		{
			s= new Student(iter.next());
			c = new Student(s);
			
			if((s.last.equals("")&&s.first.equals(""))
					||(s.grade.equals("FAC"))||(s.grade.equals("EXMPT")))
				iter.remove();
			
			else
			{
				for(Student v:verifyStudents)
				{
					if(s.ID.equals(v.ID))
					{
						s.ref = c.ref;
						homeroomVerify(s,v);
						namesVerify(s,v);
						gradeVerify(s,v);
						
						verifyStudents.remove(v);
						iter.remove();
						break;
					}
				}
			}
			if(foundStudent)
			{
				updateList.add(s);
				compareList.add(c);
			}
			foundStudent=false;
		}
	}
	private void nameVerify()
	{
		Collections.sort(currentStudents, new StudentLastNameSortComparator());
		Collections.sort(verifyStudents, new StudentLastNameSortComparator());
		iter = currentStudents.listIterator();

		while(iter.hasNext())
		{
			s= new Student(iter.next());
			c = new Student(s);
			
			for(Student v:verifyStudents)
			{
				if((s.last.equals(v.last))&&s.first.equals(v.first))
				{
					s.ref=c.ref;
					homeroomVerify(s,v);
					idVerify(s,v);
					gradeVerify(s,v);
					
					verifyStudents.remove(v);
					iter.remove();
					break;
				}
			}
			if(foundStudent)
			{
				updateList.add(s);
				compareList.add(c);
			}
			foundStudent=false;
		}
	}
	public void removeRow(int row)
	{
		compareList.remove(row);
		updateList.remove(row);
		verifyGUI.updateTable(buildTable());
	}
	
	private String[][] buildTable()
	{
		String[][] array = new String[compareList.size()][11];
		for(int i=0;i<compareList.size();i++)
		{
			array[i][0]=compareList.get(i).ref;
			array[i][1]=compareList.get(i).last;
			array[i][2]=compareList.get(i).first;
			array[i][3]=compareList.get(i).ID;
			array[i][4]=compareList.get(i).grade;
			array[i][5]=compareList.get(i).homeroom;
			array[i][6]=updateList.get(i).last;
			array[i][7]=updateList.get(i).first;
			array[i][8]=updateList.get(i).ID;
			array[i][9]=updateList.get(i).grade;
			array[i][10]=updateList.get(i).homeroom;	
		}
		return array;
	}
	public void saveChanges()
	{
		students.updateStudents(updateList);
		studentGUI.reloadInfo();
		verifyGUI.dispose();
	}
	private void buildTables()
	{
		String[][] remVer = new String[verifyStudents.size()][5];
		for(int i=0;i<verifyStudents.size();i++)
		{
			remVer[i][0]=verifyStudents.get(i).last;
			remVer[i][1]=verifyStudents.get(i).first;
			remVer[i][2]=verifyStudents.get(i).ID;
			remVer[i][3]=verifyStudents.get(i).grade;
			remVer[i][4]=verifyStudents.get(i).homeroom;
		}
		String[][] remStu = new String[currentStudents.size()][5];
		for(int i=0;i<currentStudents.size();i++)
		{
			remStu[i][0]=currentStudents.get(i).last;
			remStu[i][1]=currentStudents.get(i).first;
			remStu[i][2]=currentStudents.get(i).ID;
			remStu[i][3]=currentStudents.get(i).grade;
			remStu[i][4]=currentStudents.get(i).homeroom;
		}
		verifyGUI = new ConfirmVerifyGUI(this,buildTable(),remVer,remStu);
		studentGUI.getDesktopWindow().add(verifyGUI);
		verifyGUI.moveToFront();
	}
	//Remaining Verify List Table
	private String[][] buildTable_1()
	{
		String[][] remVer = new String[verifyStudents.size()][5];
		for(int i=0;i<verifyStudents.size();i++)
		{
			remVer[i][0]=verifyStudents.get(i).last;
			remVer[i][1]=verifyStudents.get(i).first;
			remVer[i][2]=verifyStudents.get(i).ID;
			remVer[i][3]=verifyStudents.get(i).grade;
			remVer[i][4]=verifyStudents.get(i).homeroom;
		}
		return remVer;
	}
	public void removeRemVer(int index, boolean removeAll)
	{
		if(!removeAll) verifyStudents.remove(index);
		else verifyStudents.clear();
		verifyGUI.updateTable_1(buildTable_1());
	}
	public void addRemVer()
	{
		students.addStudents(verifyStudents);
	}
	/**
	 * 
	 * Verifies the names of the students
	 * 
	 * @param s Student from original list
	 * @param v Student from verify list
	 */
	private void namesVerify(Student s, Student v)
	{
		if((!s.last.toUpperCase().equals(v.last.toUpperCase()))||(!s.first.toUpperCase().equals(v.first.toUpperCase())))
		{
			Object[] options = {"Yes","NO"};
			int n = JOptionPane.showOptionDialog(null, "Would you like to make the following changes:\n"
					+ s.last+" with "+v.last+" and\n"
							+ s.first+" with "+v.first+"?", "Name mismatch Ref: "+s.ref 
							, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			if(n==JOptionPane.YES_OPTION)
			{
				s.last =v.last;
				s.first = v.first;
				foundStudent=true;
			}
		}
	}
	/**
	 * 
	 * 
	 * Verifies the grade of the students
	 * @param s Student from original list
	 * @param v Student from verify list
	 */
	private void gradeVerify(Student s, Student v)
	{
		if(!s.grade.equals(v.grade))
		{
			Object[] options = {"Yes","NO"};
			int n = JOptionPane.showOptionDialog(null, "Would you like to make the following changes:\n"
					+ s.grade+" with "+v.grade+" for "
							+ s.first+" "+s.last+"?", "Grade mismatch Ref: "+s.ref 
							, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			if(n==JOptionPane.YES_OPTION)
			{
				s.grade = v.grade;
				foundStudent=true;
			}
		}
	}
	/**
	 * 
	 * 
	 * Verifies the ID of the students without ID Numbers
	 * @param s Student from original list
	 * @param v Student from verify list
	 */
	private void idVerify(Student s, Student v)
	{
		if(!s.ID.equals(v.ID))
		{
			Object[] options = {"Yes","NO"};
			int n = JOptionPane.showOptionDialog(null, "Would you like to make the following changes:\n"
					+ s.ID+" with "+v.ID+" for "
							+ s.first+" "+s.last+"?", "ID mismatch Ref: "+s.ref 
							, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			if(n==JOptionPane.YES_OPTION)
			{
				s.ID = v.ID;
				foundStudent=true;
			}
		}
	}
	
	/**
	 * 
	 * Verifies if the homerooms are the same
	 * 
	 * @param s Student from original list
	 * @param v Student from verify list
	 * @return true if changes were saved to the update list, false if not
	 */
	private Boolean homeroomVerify(Student s, Student v)
	{
		if(!s.homeroom.equals(teach=v.homeroom))
		{
			Object[] options = {"Yes","NO"};
			int n = JOptionPane.showOptionDialog(null, "Are these Homerooms the same? If yes, you will not be prompted\n"
					+ "about this homeroom again.  If no, then the homeroom will be replaced with the new one.\n"
					+ "Current Homeroom: "+s.homeroom+"\t new: "+v.homeroom, "Name mismatch Ref: "+s.ref 
							, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			
			if(n==JOptionPane.YES_OPTION)
			{
				for(Student u:verifyStudents)
				{
					if(u.homeroom.equals(teach)) u.homeroom = s.homeroom;
				}
			}
			else
			{
				s.homeroom = teach;
				foundStudent=true;
				return true;
			}
		}
		return false;
	}
	
}
