import{bg as y,cH as P,bR as e,ca as v,c7 as R}from"./iframe-DogXi1kP.js";import{a as V,$ as I,i as T,d as q,c as F,g as H,h as G,e as M,n as A,b as h,l as C,k as N,j as E}from"./DatePicker-CRjletPF.js";import{b as k}from"./Button-Fh9tm360.js";import{$ as U}from"./Input-BStAHKnh.js";import{R as O,J,F as Y}from"./index-RV6Ph9vd.js";import{$ as Z}from"./Heading-CeGRyyrD.js";import{F as K}from"./FieldLabel-DFPXv5Zo.js";import{F as Q}from"./FieldError-VyUtu5uM.js";import{P as X}from"./Popover-BtilOXVD.js";import{a as ee}from"./useFormValidation-BIYlJHZ1.js";import{$ as ae}from"./I18nProvider-Cag9fozJ.js";import{B as re}from"./Button-DOk-0Wn9.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./Text-BRIb-OAb.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./useLabels-DnC-SBWU.js";import"./useUpdateEffect-DmuMjo48.js";import"./getItemCount-C0QHxlzQ.js";import"./useCollection-D7sNZtry.js";import"./Hidden-CYdnfqbh.js";import"./keyboard-a1n3wmz-.js";import"./FocusScope-C_GT869N.js";import"./useEvent-EwjaUY4k.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useControlledState-CrzRLYRc.js";import"./useHover-ox9S2Piy.js";import"./VisuallyHidden-BwKEPC3N.js";import"./useField-DTPdncVL.js";import"./useLabel-DvnqIlMC.js";import"./useFormReset-CXIeSoiQ.js";import"./useFilter-CBfUSc_L.js";import"./useSpinButton-AQYg4rqA.js";import"./number-C2ZI7feN.js";import"./Dialog-CuUASSK4.js";import"./useOverlayTriggerState-NZ_YQKiz.js";import"./Autocomplete-DYW-F-Tj.js";import"./animation-NVFnR0bW.js";import"./FieldError-CzpSx-Mx.js";import"./Label-BT3yvL3F.js";import"./useButton-C2CjCUzA.js";import"./definition-Bl2138zY.js";const $={"bui-DatePicker":"_bui-DatePicker_jmpnx_24","bui-DatePickerGroup":"_bui-DatePickerGroup_jmpnx_36","bui-DatePickerButton":"_bui-DatePickerButton_jmpnx_87","bui-DatePickerDateInput":"_bui-DatePickerDateInput_jmpnx_98","bui-DatePickerSegment":"_bui-DatePickerSegment_jmpnx_118","bui-DatePickerCalendar":"_bui-DatePickerCalendar_jmpnx_192","bui-DatePickerCalendarHeader":"_bui-DatePickerCalendarHeader_jmpnx_197","bui-DatePickerCalendarHeading":"_bui-DatePickerCalendarHeading_jmpnx_204","bui-DatePickerCalendarNavButton":"_bui-DatePickerCalendarNavButton_jmpnx_213","bui-DatePickerCalendarGrid":"_bui-DatePickerCalendarGrid_jmpnx_246","bui-DatePickerCalendarHeaderCell":"_bui-DatePickerCalendarHeaderCell_jmpnx_252","bui-DatePickerCalendarCell":"_bui-DatePickerCalendarCell_jmpnx_265"},te=y()({styles:$,classNames:{root:"bui-DatePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),ie=y()({styles:$,classNames:{root:"bui-DatePickerGroup",dateInput:"bui-DatePickerDateInput",segment:"bui-DatePickerSegment",button:"bui-DatePickerButton"},bg:"consumer",propDefs:{}}),se=y()({styles:$,classNames:{root:"bui-DatePickerCalendar",header:"bui-DatePickerCalendarHeader",heading:"bui-DatePickerCalendarHeading",navButton:"bui-DatePickerCalendarNavButton",grid:"bui-DatePickerCalendarGrid",gridHeader:"bui-DatePickerCalendarGridHeader",headerCell:"bui-DatePickerCalendarHeaderCell",gridBody:"bui-DatePickerCalendarGridBody",cell:"bui-DatePickerCalendarCell"},propDefs:{}}),w=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=P(ie,{}),{classes:s}=a;return e.jsxs(U,{className:s.root,...i,...r?{"data-size":r}:{},children:[e.jsx(V,{className:s.dateInput,children:o=>e.jsx(I,{segment:o,className:s.segment})}),e.jsx(k,{className:s.button,"aria-label":"Open calendar",children:e.jsx(O,{size:16,"aria-hidden":"true"})})]})};w.__docgenInfo={description:`Custom field group for DatePicker — renders a single DateInput field
and a calendar trigger button.

@internal`,methods:[],displayName:"DatePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const S=()=>{const{ownProps:r}=P(se,{}),{classes:a}=r;return e.jsxs(T,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(k,{slot:"previous",className:a.navButton,children:e.jsx(J,{size:16,"aria-hidden":"true"})}),e.jsx(Z,{className:a.heading}),e.jsx(k,{slot:"next",className:a.navButton,children:e.jsx(Y,{size:16,"aria-hidden":"true"})})]}),e.jsxs(q,{className:a.grid,children:[e.jsx(F,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};S.__docgenInfo={description:`Calendar popover content for DatePicker — renders the Calendar with
navigation and a full calendar grid.

@internal`,methods:[],displayName:"DatePickerCalendar"};const n=v.forwardRef((r,a)=>{const{ownProps:i,restProps:s,dataAttributes:o}=P(te,r),{classes:B,label:g,description:L,secondaryLabel:W}=i,j=s["aria-label"],_=s["aria-labelledby"];v.useEffect(()=>{!g&&!j&&!_&&console.warn("DatePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[g,j,_]);const z=W||(s.isRequired?"Required":null);return e.jsxs(A,{className:B.root,...o,...s,ref:a,children:[e.jsx(K,{label:g,secondaryLabel:z,description:L,descriptionSlot:"description"}),e.jsx(w,{dataSize:o["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(S,{})})]})});n.displayName="DatePicker";n.__docgenInfo={description:`A date picker that combines a date field and a calendar popover, allowing
users to enter or select a date with full keyboard and screen reader
accessibility.

@public`,methods:[],displayName:"DatePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const t=R.meta({title:"Backstage UI/DatePicker",component:n,args:{style:{width:280}}}),d=t.story({args:{}}),c=t.story({args:{label:"Date"}}),p=t.story({args:{label:"Date",description:"Select the date of your event."}}),u=t.story({args:{label:"Booking date",defaultValue:h("2025-02-03")}}),m=t.story({args:{label:"Date"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=t.story({args:{label:"Trip date",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=t.story({args:{label:"Date",isDisabled:!0,defaultValue:h("2025-03-01")}}),D=t.story({args:{label:"Date",isInvalid:!0,errorMessage:"The selected date is not available.",defaultValue:h("2025-04-01")}}),x=t.story({args:{label:"Date",description:"You can only select dates within the next 30 days.",minValue:C(N()),maxValue:C(N()).add({days:30})}}),l=t.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable.",isDateUnavailable:i=>E(i,a)})}});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...d.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date'
  }
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    description: 'Select the date of your event.'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Booking date',
    defaultValue: parseDate('2025-02-03')
  }
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 280
  }}>
      <DatePicker {...args} size="small" label="Small" />
      <DatePicker {...args} size="medium" label="Medium" />
    </div>
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Trip date',
    isRequired: true
  },
  render: args => <Form onSubmit={e => {
    e.preventDefault();
  }} style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 280
  }}>
      <DatePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    isDisabled: true,
    defaultValue: parseDate('2025-03-01')
  }
})`,...f.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    isInvalid: true,
    errorMessage: 'The selected date is not available.',
    defaultValue: parseDate('2025-04-01')
  }
})`,...D.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...x.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DatePicker {...args} label="Working days only" description="Weekends are unavailable." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...l.input.parameters?.docs?.source},description:{story:"Weekends are marked unavailable and cannot be selected.",...l.input.parameters?.docs?.description}}};const Qe=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{d as Default,f as Disabled,D as Invalid,b as Required,m as Sizes,u as WithDefaultValue,p as WithDescription,c as WithLabel,x as WithMinMaxValue,l as WithUnavailableDates,Qe as __namedExportsOrder};
