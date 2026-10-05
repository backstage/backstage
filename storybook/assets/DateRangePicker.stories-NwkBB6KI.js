import{aO as x,aP as R,j as e,r as v,p as I}from"./iframe-CbQECOPA.js";import{$ as C,a as j,m as V,c as T,d as q,e as H,f as G,g as M,n as A,i as o,j as N,k as w,l as E}from"./DatePicker-CjcejbOq.js";import{$ as P}from"./Button-CqUujd7S.js";import{c as U}from"./Input-CjJ1M9tR.js";import{F as O,v as Y,r as Z}from"./index-CVJ_DY1z.js";import{$ as J}from"./Heading-t8vg85oi.js";import{F as K}from"./FieldLabel-dShiW8C9.js";import{F as Q}from"./FieldError-R52eNSBw.js";import{P as X}from"./Popover-DrA163h3.js";import{$ as ee}from"./useFormValidation-CKGiJz9e.js";import{$ as ae}from"./I18nProvider-X_rloAM9.js";import{B as re}from"./Button--CzoRD6y.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BjKqyDUC.js";import"./useObjectRef-rAZvTeo9.js";import"./Text-DTo7MTvL.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./useLocalizedStringFormatter-B4KkAVMn.js";import"./useLabels-Hmk_0Efx.js";import"./useUpdateEffect-Btbw-nYx.js";import"./getItemCount-B_r3Vxwo.js";import"./useCollection-DIi-vDTy.js";import"./Hidden-Cie_Gmgv.js";import"./keyboard-BiB554EB.js";import"./FocusScope-CfCaPDEx.js";import"./useEvent-DYgfpRDF.js";import"./usePress-C80y_bid.js";import"./textSelection-CTwx7Hd8.js";import"./useControlledState-BYBhhx6m.js";import"./useHover-C0zeuS3S.js";import"./VisuallyHidden-N7kQo01U.js";import"./useField-Bwd8Jmt6.js";import"./useLabel-BlUgJ3a0.js";import"./useFormReset-BJvTatsh.js";import"./useFilter-B9gIhNbK.js";import"./useSpinButton-BPRSYv7N.js";import"./number-CbNxdcRk.js";import"./Dialog-B9J-z4RW.js";import"./useOverlayTriggerState-CU1gdxD5.js";import"./Autocomplete-BNai4oWa.js";import"./animation-LCLQa1wT.js";import"./FieldError-CYK7f2yb.js";import"./Label-CmorgM_W.js";import"./useButton-hc7LOMzh.js";const h={"bui-DateRangePicker":"_bui-DateRangePicker_yazlu_24","bui-DateRangePickerGroup":"_bui-DateRangePickerGroup_yazlu_36","bui-DateRangePickerButton":"_bui-DateRangePickerButton_yazlu_87","bui-DateRangePickerDateFields":"_bui-DateRangePickerDateFields_yazlu_98","bui-DateRangePickerDateInput":"_bui-DateRangePickerDateInput_yazlu_112","bui-DateRangePickerSegment":"_bui-DateRangePickerSegment_yazlu_132","bui-DateRangePickerSeparator":"_bui-DateRangePickerSeparator_yazlu_173","bui-DateRangePickerCalendar":"_bui-DateRangePickerCalendar_yazlu_220","bui-DateRangePickerCalendarHeader":"_bui-DateRangePickerCalendarHeader_yazlu_225","bui-DateRangePickerCalendarHeading":"_bui-DateRangePickerCalendarHeading_yazlu_232","bui-DateRangePickerCalendarNavButton":"_bui-DateRangePickerCalendarNavButton_yazlu_242","bui-DateRangePickerCalendarGrid":"_bui-DateRangePickerCalendarGrid_yazlu_275","bui-DateRangePickerCalendarHeaderCell":"_bui-DateRangePickerCalendarHeaderCell_yazlu_281","bui-DateRangePickerCalendarCell":"_bui-DateRangePickerCalendarCell_yazlu_300"},te=x()({styles:h,classNames:{root:"bui-DateRangePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),se=x()({styles:h,classNames:{root:"bui-DateRangePickerGroup",dateFields:"bui-DateRangePickerDateFields",dateInput:"bui-DateRangePickerDateInput",segment:"bui-DateRangePickerSegment",separator:"bui-DateRangePickerSeparator",button:"bui-DateRangePickerButton"},bg:"consumer",propDefs:{}}),ie=x()({styles:h,classNames:{root:"bui-DateRangePickerCalendar",header:"bui-DateRangePickerCalendarHeader",heading:"bui-DateRangePickerCalendarHeading",navButton:"bui-DateRangePickerCalendarNavButton",grid:"bui-DateRangePickerCalendarGrid",gridHeader:"bui-DateRangePickerCalendarGridHeader",headerCell:"bui-DateRangePickerCalendarHeaderCell",gridBody:"bui-DateRangePickerCalendarGridBody",cell:"bui-DateRangePickerCalendarCell"},propDefs:{}}),z=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=R(se,{}),{classes:t}=a;return e.jsxs(U,{className:t.root,...i,...r?{"data-size":r}:{},children:[e.jsxs("div",{className:t.dateFields,children:[e.jsx(C,{slot:"start",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})}),e.jsx("span",{"aria-hidden":"true",className:t.separator,children:"–"}),e.jsx(C,{slot:"end",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})})]}),e.jsx(P,{className:t.button,"aria-label":"Open calendar",children:e.jsx(O,{size:16,"aria-hidden":"true"})})]})};z.__docgenInfo={description:`Custom field group for DateRangePicker — renders two DateInput fields,
a separator, and a calendar trigger button.

@internal`,methods:[],displayName:"DateRangePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const S=()=>{const{ownProps:r}=R(ie,{}),{classes:a}=r;return e.jsxs(V,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(P,{slot:"previous",className:a.navButton,children:e.jsx(Y,{size:16,"aria-hidden":"true"})}),e.jsx(J,{className:a.heading}),e.jsx(P,{slot:"next",className:a.navButton,children:e.jsx(Z,{size:16,"aria-hidden":"true"})})]}),e.jsxs(T,{className:a.grid,children:[e.jsx(q,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};S.__docgenInfo={description:`Calendar popover content for DateRangePicker — renders the RangeCalendar
with navigation and a full calendar grid.

@internal`,methods:[],displayName:"DateRangePickerCalendar"};const n=v.forwardRef((r,a)=>{const{ownProps:i,restProps:t,dataAttributes:l}=R(te,r),{classes:B,label:k,description:L,secondaryLabel:F}=i,$=t["aria-label"],_=t["aria-labelledby"];v.useEffect(()=>{!k&&!$&&!_&&console.warn("DateRangePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[k,$,_]);const W=F||(t.isRequired?"Required":null);return e.jsxs(A,{className:B.root,...l,...t,ref:a,children:[e.jsx(K,{label:k,secondaryLabel:W,description:L,descriptionSlot:"description"}),e.jsx(z,{dataSize:l["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(S,{})})]})});n.displayName="DateRangePicker";n.__docgenInfo={description:`A date range picker that combines two date fields and a calendar popover,
allowing users to enter or select a date range with full keyboard and
screen reader accessibility.

@public`,methods:[],displayName:"DateRangePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date range picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const s=I.meta({title:"Backstage UI/DateRangePicker",component:n,args:{style:{width:360}}}),c=s.story({args:{}}),u=s.story({args:{label:"Date range"}}),p=s.story({args:{label:"Date range",description:"Select a start and end date for your event."}}),m=s.story({args:{label:"Booking period",defaultValue:{start:o("2025-02-03"),end:o("2025-02-14")}}}),g=s.story({args:{label:"Date range"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=s.story({args:{label:"Trip dates",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),D=s.story({args:{label:"Date range",isDisabled:!0,defaultValue:{start:o("2025-03-01"),end:o("2025-03-15")}}}),f=s.story({args:{label:"Date range",isInvalid:!0,errorMessage:"The selected range is not available.",defaultValue:{start:o("2025-04-01"),end:o("2025-04-10")}}}),y=s.story({args:{label:"Date range",description:"You can only select dates within the next 30 days.",minValue:N(w()),maxValue:N(w()).add({days:30})}}),d=s.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable. You cannot select a range that spans across them.",isDateUnavailable:i=>E(i,a)})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  }
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'Select a start and end date for your event.'
  }
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Booking period',
    defaultValue: {
      start: parseDate('2025-02-03'),
      end: parseDate('2025-02-14')
    }
  }
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} size="small" label="Small" />
      <DateRangePicker {...args} size="medium" label="Medium" />
    </div>
})`,...g.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Trip dates',
    isRequired: true
  },
  render: args => <Form onSubmit={e => {
    e.preventDefault();
  }} style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
})`,...b.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isDisabled: true,
    defaultValue: {
      start: parseDate('2025-03-01'),
      end: parseDate('2025-03-15')
    }
  }
})`,...D.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isInvalid: true,
    errorMessage: 'The selected range is not available.',
    defaultValue: {
      start: parseDate('2025-04-01'),
      end: parseDate('2025-04-10')
    }
  }
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...y.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DateRangePicker {...args} label="Working days only" description="Weekends are unavailable. You cannot select a range that spans across them." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...d.input.parameters?.docs?.source},description:{story:`Weekends are marked unavailable. Because \`allowsNonContiguousRanges\` is not
set (defaults to false), the picker prevents the user from selecting any
range that spans across an unavailable date — the selection snaps to avoid
crossing a weekend.`,...d.input.parameters?.docs?.description}}};const Ke=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{c as Default,D as Disabled,f as Invalid,b as Required,g as Sizes,m as WithDefaultValue,p as WithDescription,u as WithLabel,y as WithMinMaxValue,d as WithUnavailableDates,Ke as __namedExportsOrder};
