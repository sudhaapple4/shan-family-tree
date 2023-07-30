import React, { useState,useRef, useCallback } from 'react';
import './FamilyTree.css';

//type for gender 
type genderT="male" | "female"
//interface for Family member uniqueness
interface FamilyMember {
  id: number;
  name: string;
  gender:genderT;
  spouse?: FamilyMember;
  children?: FamilyMember[];
}
///same data for testing
const familyData0: FamilyMember[] = [{
  id: Date.now(),
  name: 'King Shan',
  gender: 'male',
  spouse: {id: Date.now(),name: 'Queen Anga',gender:'female' },
  children:[{id: Date.now(),name: 'Chit',
  gender: 'male',
  // spouse: {name: 'Ambi',gender:'female' },
  // children:[{name: 'Chit0',
  // gender: 'male'}]
},
  {id: Date.now(),name: 'Chit1',
  gender: 'male',
  // spouse: {name: 'Ambi1',gender:'female' }
}
]
}];

const FamilyTree = () => {
  //ref to capture the value from the input field
  const inputRef=useRef<HTMLInputElement | null>(null);
  //state to maintain the data. Initially we set the default King Shan and Qeen Ange data to populate when the page is loaded
  const [familyData, setfamilyData] = useState<FamilyMember[]>([{
    id: Date.now(),
    name: 'King Shan',
    gender: 'male',
    spouse: {id: Date.now(),name: 'Queen Anga',gender:'female' },
    children:[]
  }]);
//state to hold the drop down value
  const [selectedValue, setSelectedValue] = useState<string>("");
// set to hold grand child data. Used Set to remove duplicates
  let gc=new Set([])
//method to get female child for question 3
  const fetchGirls=(member:any)=>{
    member.map((child)=> {
      child.children.map((c)=> {//console.log('00',c)
        if(!c.children){
        if(c.gender==='female')gc.add(child.gender==='male'?child.spouse.name:child.name)
      }else{
        fetchGirls([c])
        // console.log('11',c)
      }} )
    })
    // darr=[...gc]
    console.log([...gc])
    alert (([...gc]))
    // console.log('darr ',darr)
  }
//method to grand all grand children and people who are single
  let grChild=new Set()
  const fetchGrandChild=(member:any)=>{
    // console.log(member)
    member.map((c)=>{
      if(c.children){
        
      c.children.map((sc)=>  {grChild.add(sc.name);if(sc.children){
        // console.log('---',sc.children)
        fetchGrandChild(sc.children)}})
        // grChild.add(child.name)
      }
      else{
        console.log(c)
        grChild.add(c.name)
      }
    })
    console.log([...grChild])
    alert([...grChild])
  }
  //method to display data in the console for questions 2 and 3, for question 1, select brothers/sisters from select list , then click on Ish to get the Chit Vish values
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSelectedValue(selectedOption);
    //problem 3
    if (selectedOption==='girlchild'){
      console.log('Question 3 get girl childs')
      const getChildren=familyData[0].children.filter((getChild)=>getChild.children)
      // console.log(getChildren)
      fetchGirls(getChildren)
    }
    else if(selectedOption==='getgrandchild'){
      console.log('Question 2, Get all grand children')
      fetchGrandChild(familyData[0].children)
    }
    //problem 2 to get sil
    else if(selectedOption==='sil'){
      //to get sister in law
      console.log('Question 2, Sister in law of first Generation')
      console.log(familyData[0].children.filter((mem)=>(mem.gender ==='male' && mem.spouse ? mem.spouse.name:'')).map((s)=>(s.spouse.name)))
      alert('Sister in law of first Generation'+familyData[0].children.filter((mem)=>(mem.gender ==='male' && mem.spouse ? mem.spouse.name:'')).map((s)=>(s.spouse.name)))

    }
    else if(selectedOption==='brother' ||selectedOption==='sister'){
      console.log('Get Sisters / brothers of first generation')
      // console.log(familyData[0].children)
      console.log(familyData[0].children?.filter((mem)=>(mem.gender=== (selectedOption==='brother'? 'male' :'female' ) )))
      alert('Get Sisters / brothers of first generation '+familyData[0].children?.filter((mem)=>(mem.gender=== (selectedOption==='brother'? 'male' :'female' ) )).map((val)=>(val.name)))

    }
    else{gc=null;grChild=null;}
  };
//method to add child and construts family tree
  const handleClick = (value: string,gender:genderT) => {

    const clonedData = familyData.map((person) => {
      if (person.name === value) {        
        const children = [...person.children||[]];
        children.push({id: Date.now(),name: inputRef.current?.value!,gender: gender})
        // return { ...person, children: clonedchildren };
        const res = {...person, children: children}
        setfamilyData([res].sort((a,b)=>a.id-b.id))
        return null;
      }
      else{ 
        const getChild=person.children?.map((child)=>{
          if (child.name === value){
            if (selectedValue==='spouse' ||selectedValue==='husband'){
            const children = {...child};
            children.spouse={id: child.id||Date.now(),name:inputRef.current?.value!,gender:selectedValue==='spouse'? 'female' :'male'}
            console.log(children)
            const res = {...person, children: [children]}
            const res1=[...person.children||[],res.children[0]]
            const ids = res1.map(({ name }) => name);
            const filtered = res1.filter(({ name }, index) =>
                !ids.includes(name, index + 1));
            res.children=filtered;
            setfamilyData([res].sort((a,b)=>a.id-b.id))
            }
            else if(selectedValue==='child' && !person.children[0].children){
              const children = [...child.children||[]]; 
              console.log('1st',children,value,gender)
              if(true){
              children.push({id: Date.now(),name: inputRef.current?.value!,gender: gender})

              child.children=children
              console.log('1st child',child)
              person.children?.push(child)
              const ids = person.children?.map(({ name }) => name)||[];
              const filtered = person.children?.filter(({ name }, index) =>
                  !ids.includes(name, index + 1));
              console.log(filtered)
              const res = {...person, children: filtered}
              setfamilyData([res].sort((a,b)=>a.id-b.id))
            }
            }
            else if(selectedValue==='brother' ||selectedValue==='sister'){
              console.log('--')
              alert(familyData[0].children.filter((child)=>child.gender===(selectedValue==='brother'? 'male' :'female' )).filter((sc,i)=>i).map((val)=>(val.name)))

              // console.log(familyData[0].children)
              // console.log(familyData[0].children?.filter((mem)=>(mem.gender=== (selectedValue==='brother'? 'male' :'female' ) )))
            }
          }
          else if(child.children) {
            if (selectedValue==='spouse'||selectedValue==='husband'){
              const children = {...child};
              let childIndex
              try{
              childIndex = person.children.findIndex((person) => person.name === value);
               if (childIndex<0){
                //@ts-ignore
                childIndex = person.children.children.findIndex((person) => person.name === value); 
              }
              }catch(e){}
              let sID=children.children.findIndex((c)=>c.name===value)
              try{
                //@ts-ignore
                if(children.name===value){
                  // console.log('here11')
               children.spouse={id: child.id||Date.now(),name:inputRef.current?.value!,gender:selectedValue==='spouse'? 'female' :'male'}
                }
                if(children.children[sID].name===value){
                  // console.log('here22')
                  children.children[sID].spouse={id: child.id||Date.now(),name:inputRef.current?.value!,gender:selectedValue==='spouse'? 'female' :'male'}
                }
              }catch(e){
                try{
              children.children[childIndex].spouse={id: child.id||Date.now(),name:inputRef.current?.value!,gender:'female'}
            }catch(e){}
            }finally{}
              console.log('--C',children.children)
              // console.log({...person})
              const getChild=person.children?.map((child)=>{
                console.log('--C1',child.name,children.name)
                if(child.name===children.name){
                  const res0= [...person.children,children]
                  console.log('res0-------- ',res0)
                  const ids = res0.map(({name }) => name)||[];
                  const filtered = res0.filter(({ name }, index) =>
                      !ids.includes(name, index + 1));
                  console.log(filtered)
                  const res = {...person, children: filtered}
                  console.log('---res ',res)
                  setfamilyData([res].sort((a,b)=>a.id-b.id))
                }

              })
              }
              else if(selectedValue==='brother' ||selectedValue==='sister'){
                // console.log('--',value)
                console.log(familyData[0].children.filter((child)=>child.gender===(selectedValue==='brother'? 'male' :'female' )).filter((sc,i)=>i))
                // console.log(familyData[0].children)
                alert(familyData[0].children.filter((child)=>child.gender===(selectedValue==='brother'? 'male' :'female' )).filter((sc,i)=>i).map((val)=>(val.name)))

              }
              else if (selectedValue==='grandchild' ){
                const children = [...child.children||[]]; 
                let childIndex; 
                try{
                 childIndex = person.children.findIndex((person) => person.name === value||person?.children[0]?.name === value);
                }catch(e){childIndex=-1}
                if(children[0].name===value){
                children[0].children=[{id: child.id||Date.now(),name: inputRef.current?.value!,gender: gender}]
              }  
              const ids = person.children?.map(({ name }) => name)||[];
              const filtered = person.children?.filter(({ name }, index) =>
                  !ids.includes(name, index + 1));
                const res = {...person, children:filtered}
                setfamilyData([res].sort((a,b)=>a.id-b.id))
              }


          }
          return null;
        })
    }
    });
  };

  // const handleClick1=useCallback(handleClick,[familyData[0].name])
  const renderFamilyTree = (person: FamilyMember) => (
    <div key={person.id} className="family-member">    
      <div className='container'>
      <div className={person.gender==='male'? "common male" :"common female"} onClick={()=>handleClick(person.name,person.gender)}>{person.name} </div>
      <div className={person.spouse?.name? person.spouse?.gender==='female'? "common female" :'common male' : ''} onClick={()=>handleClick(person.name,'female')}>{person.spouse?.name} </div>
      </div>
      {//@ts-ignore
      person.children && person.children.length > 0 && !person.children?.children && (
        <div className="children">
          {person.children.map((child) => renderFamilyTree(child))}
        </div>
      )}
    </div>
  );

  return (
    <>
    <div>
    <div className="family-tree">
      <h1 style={{color:'orange'}}>Family Tree</h1>
      {renderFamilyTree(familyData[0])}
    </div>

    <label htmlFor="child">Enter Child:</label>
    <input type="text" name="child" ref={inputRef}  placeholder="Enter child"/>
    <div>
          <label htmlFor="relation">Relation:</label>
          <select name="relation" required value={selectedValue} onChange={handleSelectChange}>
          <option value="--">--</option>
            <option value="spouse">Spouse</option>
            <option value="husband">Husband</option>
            <option value="brother">Brothers</option>
            <option value="sister">Sisters</option>
            <option value="child">Child</option>
            <option value="grandchild">Grand Child</option>
            <option value="getgrandchild">Get Grand Child</option>
            <option value="girlchild">Get Girl Child</option>
            <option value="sil">Sister in law</option>
          </select>
        </div>
    </div>
   
            {/* <div className='box'>
            <div style={{color:'white',display:'flex'}}>
          <span >The Shan Family Tree</span>
          <div>
        <span>Male</span>
        <span>Female</span>
        </div>
      </div>
    </div> */}
        <div className='box'>
  <div >The Shan Family Tree</div>
  <div className='box1'><div className="circle male"></div>&nbsp;<span>Male</span>&nbsp;
  <div className="circle female"></div>&nbsp;<span>Female</span></div>
</div>
    </>
  );
};

export default FamilyTree;
