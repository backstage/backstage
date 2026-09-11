import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-CZAQRplz.js";import{P as l}from"./PluginHeader-CYJYxalI.js";import{C as p}from"./Container-BAO2IQzP.js";import{T as t}from"./Text-DY2YjVjO.js";import{B as j}from"./BUIProvider-DYyFDI-V.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3WcWjUz.js";import"./utils-BddjkJjV.js";import"./useObjectRef-DwsoHqPD.js";import"./useCollection-BTBd6Q10.js";import"./useFocusRing-w6vd38rs.js";import"./openLink-CS4qCOfy.js";import"./Hidden-nk8B1O_e.js";import"./keyboard-31lURow8.js";import"./FocusScope-DxBZY3Gl.js";import"./useEvent-cTre3tI4.js";import"./I18nProvider-Dmp-YX3j.js";import"./usePress-QNMEwl8q.js";import"./textSelection-DmuaJtMt.js";import"./useControlledState-Cx450bSi.js";import"./Link-DsrSO2zf.js";import"./useLink-Bp9aGHsR.js";import"./useHover-CrLHZKML.js";import"./useLocalizedStringFormatter-DCKaeSgE.js";import"./Button-ByHr54p0.js";import"./Label-Z5tvaBq7.js";import"./useLabel-CveRpJyO.js";import"./useLabels-D2HB4ybw.js";import"./number-BaLbbo2Y.js";import"./useButton-CKjpqyyh.js";import"./Menu-Bm9_FrSd.js";import"./Autocomplete-DrhcM_th.js";import"./getItemCount-79iPCaxN.js";import"./Input-BGZ5ZOMc.js";import"./ListBox-BcYAFsVd.js";import"./Text-oz8KmHCB.js";import"./useListState-BIvwUSVs.js";import"./Dialog-B1Uzi68w.js";import"./Heading-ugg1DCO5.js";import"./useOverlayTriggerState-BMaBp8bg.js";import"./VisuallyHidden-Y5ImMuSV.js";import"./animation-5CSH7QQO.js";import"./SearchField-BjcHwEhg.js";import"./FieldError-Dqt9OQB4.js";import"./useFormValidation-C7BXlo68.js";import"./useTextField-BQ0nsv3j.js";import"./useField-D2ei1an_.js";import"./useFormReset-L2mPc2fw.js";import"./Virtualizer-Dd1lrDQ3.js";import"./useFilter-BlYk1YVC.js";import"./getNodeText-LQFlxaCI.js";import"./Link-CAL3_sDB.js";import"./useResolvedHref-Ddyd4aYm.js";import"./Tooltip-BbrTD1_A.js";import"./VisuallyHidden-DGoOc1Oj.js";import"./Tabs-DRl7dpmz.js";import"./useHasTabbableChild-CrF-go3M.js";import"./BUIRoutingProvider-C_mkOCzL.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
