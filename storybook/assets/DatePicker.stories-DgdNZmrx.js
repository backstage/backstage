import{ax as y,f as P,j as e,r as C,p as V}from"./iframe-nLmXqEf7.js";import{$ as I,a as T,b as q,c as H,d as R,e as F,f as G,g as M,h as A,i as h,j,k as z,l as E}from"./DatePicker-g0ovomB0.js";import{$ as k}from"./Button-C296zZfo.js";import{c as U}from"./Input-BueuAVR-.js";import{H as O,v as Y,r as Z}from"./index-BcfFmlps.js";import{$ as J}from"./Heading-BuXrZ9Hf.js";import{F as K}from"./FieldLabel-Cwrz3oLT.js";import{F as Q}from"./FieldError-BGxAebJ0.js";import{P as X}from"./Popover-CinninWd.js";import{$ as ee}from"./useFormValidation-Coh1_1M8.js";import{$ as ae}from"./I18nProvider--lkhv8yr.js";import{B as re}from"./Button-10BUDNfS.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BHAGaPmB.js";import"./useObjectRef-BxjTy_io.js";import"./Text-D4GNDssI.js";import"./useFocusRing-CRF3QW5j.js";import"./openLink-52acbO8n.js";import"./useLocalizedStringFormatter-CdDwfP8u.js";import"./useLabels-Bv7MIFK3.js";import"./useUpdateEffect-DBBz6vMQ.js";import"./getItemCount-Dwowez1m.js";import"./useCollection-D-2zPf8m.js";import"./Hidden-Droxpmwn.js";import"./keyboard-Dzy1pKfB.js";import"./FocusScope-De3cvvw0.js";import"./useEvent-C9J8YBp8.js";import"./usePress-BTMgok7y.js";import"./textSelection-C5-Yq1FE.js";import"./useControlledState-I4v4Pk17.js";import"./useHover-DzrNdeA5.js";import"./VisuallyHidden-D6zotimm.js";import"./useField-Daqylzv8.js";import"./useLabel-BbXuH4g9.js";import"./useFormReset-Bmvk1LvB.js";import"./useFilter-Iscc1qHc.js";import"./number-Dv4JZ_AA.js";import"./Dialog-DCU4zn0B.js";import"./useOverlayTriggerState-WIWunhdp.js";import"./Autocomplete-2mvVyjFP.js";import"./animation-CIIPdLix.js";import"./FieldError-JUfGZ6Pi.js";import"./Label-DiUjif3Y.js";import"./useButton-D7NyzVB-.js";import"./definition-BgPB0HuP.js";const $={"bui-DatePicker":"_bui-DatePicker_odzoc_24","bui-DatePickerGroup":"_bui-DatePickerGroup_odzoc_36","bui-DatePickerButton":"_bui-DatePickerButton_odzoc_87","bui-DatePickerDateInput":"_bui-DatePickerDateInput_odzoc_98","bui-DatePickerSegment":"_bui-DatePickerSegment_odzoc_118","bui-DatePickerCalendar":"_bui-DatePickerCalendar_odzoc_192","bui-DatePickerCalendarHeader":"_bui-DatePickerCalendarHeader_odzoc_197","bui-DatePickerCalendarHeading":"_bui-DatePickerCalendarHeading_odzoc_204","bui-DatePickerCalendarNavButton":"_bui-DatePickerCalendarNavButton_odzoc_213","bui-DatePickerCalendarGrid":"_bui-DatePickerCalendarGrid_odzoc_246","bui-DatePickerCalendarHeaderCell":"_bui-DatePickerCalendarHeaderCell_odzoc_252","bui-DatePickerCalendarCell":"_bui-DatePickerCalendarCell_odzoc_265"},te=y()({styles:$,classNames:{root:"bui-DatePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),ie=y()({styles:$,classNames:{root:"bui-DatePickerGroup",dateInput:"bui-DatePickerDateInput",segment:"bui-DatePickerSegment",button:"bui-DatePickerButton"},bg:"consumer",propDefs:{}}),se=y()({styles:$,classNames:{root:"bui-DatePickerCalendar",header:"bui-DatePickerCalendarHeader",heading:"bui-DatePickerCalendarHeading",navButton:"bui-DatePickerCalendarNavButton",grid:"bui-DatePickerCalendarGrid",gridHeader:"bui-DatePickerCalendarGridHeader",headerCell:"bui-DatePickerCalendarHeaderCell",gridBody:"bui-DatePickerCalendarGridBody",cell:"bui-DatePickerCalendarCell"},propDefs:{}}),N=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=P(ie,{}),{classes:s}=a;return e.jsxs(U,{className:s.root,...i,...r?{"data-size":r}:{},children:[e.jsx(I,{className:s.dateInput,children:l=>e.jsx(T,{segment:l,className:s.segment})}),e.jsx(k,{className:s.button,"aria-label":"Open calendar",children:e.jsx(O,{size:16,"aria-hidden":"true"})})]})};N.__docgenInfo={description:`Custom field group for DatePicker — renders a single DateInput field
and a calendar trigger button.

@internal`,methods:[],displayName:"DatePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const w=()=>{const{ownProps:r}=P(se,{}),{classes:a}=r;return e.jsxs(q,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(k,{slot:"previous",className:a.navButton,children:e.jsx(Y,{size:16,"aria-hidden":"true"})}),e.jsx(J,{className:a.heading}),e.jsx(k,{slot:"next",className:a.navButton,children:e.jsx(Z,{size:16,"aria-hidden":"true"})})]}),e.jsxs(H,{className:a.grid,children:[e.jsx(R,{className:a.gridHeader,children:i=>e.jsx(F,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};w.__docgenInfo={description:`Calendar popover content for DatePicker — renders the Calendar with
navigation and a full calendar grid.

@internal`,methods:[],displayName:"DatePickerCalendar"};const o=C.forwardRef((r,a)=>{const{ownProps:i,restProps:s,dataAttributes:l}=P(te,r),{classes:S,label:x,description:B,secondaryLabel:L}=i,v=s["aria-label"],_=s["aria-labelledby"];C.useEffect(()=>{!x&&!v&&!_&&console.warn("DatePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[x,v,_]);const W=L||(s.isRequired?"Required":null);return e.jsxs(A,{className:S.root,...l,...s,ref:a,children:[e.jsx(K,{label:x,secondaryLabel:W,description:B,descriptionSlot:"description"}),e.jsx(N,{dataSize:l["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(w,{})})]})});o.displayName="DatePicker";o.__docgenInfo={description:`A date picker that combines a date field and a calendar popover, allowing
users to enter or select a date with full keyboard and screen reader
accessibility.

@public`,methods:[],displayName:"DatePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const t=V.meta({title:"Backstage UI/DatePicker",component:o,args:{style:{width:280}}}),d=t.story({args:{}}),c=t.story({args:{label:"Date"}}),p=t.story({args:{label:"Date",description:"Select the date of your event."}}),u=t.story({args:{label:"Booking date",defaultValue:h("2025-02-03")}}),m=t.story({args:{label:"Date"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(o,{...r,size:"small",label:"Small"}),e.jsx(o,{...r,size:"medium",label:"Medium"})]})}),b=t.story({args:{label:"Trip date",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(o,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=t.story({args:{label:"Date",isDisabled:!0,defaultValue:h("2025-03-01")}}),D=t.story({args:{label:"Date",isInvalid:!0,errorMessage:"The selected date is not available.",defaultValue:h("2025-04-01")}}),g=t.story({args:{label:"Date",description:"You can only select dates within the next 30 days.",minValue:j(z()),maxValue:j(z()).add({days:30})}}),n=t.story({render:r=>{const{locale:a}=ae();return e.jsx(o,{...r,label:"Working days only",description:"Weekends are unavailable.",isDateUnavailable:i=>E(i,a)})}});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...D.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...g.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DatePicker {...args} label="Working days only" description="Weekends are unavailable." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...n.input.parameters?.docs?.source},description:{story:"Weekends are marked unavailable and cannot be selected.",...n.input.parameters?.docs?.description}}};const Ke=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{d as Default,f as Disabled,D as Invalid,b as Required,m as Sizes,u as WithDefaultValue,p as WithDescription,c as WithLabel,g as WithMinMaxValue,n as WithUnavailableDates,Ke as __namedExportsOrder};
