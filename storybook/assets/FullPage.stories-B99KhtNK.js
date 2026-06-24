import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-DhttR-Z-.js";import{P as l}from"./PluginHeader-B5VdBXp7.js";import{C as p}from"./Container-jr2s8IqZ.js";import{T as t}from"./Text-XAqvAdRp.js";import{B as j}from"./BUIProvider-CUKyC6Rl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-51pH9e5U.js";import"./utils-LkJ3JQqS.js";import"./useObjectRef-BfSKs3Th.js";import"./useCollection-CmQEMhBS.js";import"./useFocusRing-BMND1Xfk.js";import"./openLink-DDEWcvNy.js";import"./Hidden-BK8KEPOj.js";import"./keyboard-BZWrF7pG.js";import"./FocusScope-B4sVtO-l.js";import"./useEvent-BqGsjR8x.js";import"./I18nProvider-DS1fhYi3.js";import"./usePress-D7UEUwIV.js";import"./textSelection-Gj6MkmHl.js";import"./useControlledState-CmzpYLdm.js";import"./Link-C7xhCPqh.js";import"./useLink-Dbm6UFvt.js";import"./useHover-DWM3_5-p.js";import"./useLocalizedStringFormatter-DPzPf3bZ.js";import"./Button-DgJKv_H5.js";import"./Label-uZej1Dod.js";import"./useLabel-DSVSe0FP.js";import"./useLabels-DbXANuou.js";import"./number-YKfsi7Zw.js";import"./useButton-8cfX40X5.js";import"./Menu-DscMNoXy.js";import"./Autocomplete-du-Wb1TU.js";import"./getItemCount-WPYudUmT.js";import"./Input-BXU-L0c3.js";import"./ListBox-BBpHvFIQ.js";import"./Text-OfXWTW-q.js";import"./useListState-DT_uuQg6.js";import"./Dialog-B4ix50AT.js";import"./Heading-CSGOVgUl.js";import"./useOverlayTriggerState-Cb5yY_lY.js";import"./VisuallyHidden-B4DWlS1H.js";import"./animation-BK6cA2RP.js";import"./SearchField-CLX91gFA.js";import"./FieldError-DMbGr69Y.js";import"./useFormValidation-CWHGY4c7.js";import"./useTextField-D-rC3zog.js";import"./useField-CV1e6J1X.js";import"./useFormReset-Buno64eF.js";import"./Virtualizer-C5JtcEks.js";import"./useFilter-DipkhEIn.js";import"./getNodeText-CqZtwMUp.js";import"./Link-D56Cadi0.js";import"./useResolvedHref-CHSc8dmW.js";import"./Tooltip-CJZfQ3_g.js";import"./VisuallyHidden-CL4h_MRf.js";import"./Tabs-u03-lzoJ.js";import"./useHasTabbableChild-C0cGfDMq.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
