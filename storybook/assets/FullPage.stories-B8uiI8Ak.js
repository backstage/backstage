import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-DXdR4xPj.js";import{P as l}from"./PluginHeader-Bu1081ip.js";import{C as p}from"./Container-BTn6ZKeL.js";import{T as t}from"./Text-BW0S3cTG.js";import{B as j}from"./BUIProvider-3mC0dqi4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBKaRO06.js";import"./utils-C-HUDFAG.js";import"./useObjectRef-CbSdwcnt.js";import"./useCollection-3GpIKzwO.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./Hidden-DEL9fdLN.js";import"./keyboard-DjhTbvoF.js";import"./FocusScope-BPEWfvie.js";import"./useEvent-Cm9ScuUm.js";import"./I18nProvider-C2KDHo4-.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./useControlledState-BREXAMRj.js";import"./Link-CC2PDxxl.js";import"./useLink-C7m3ooTt.js";import"./useHover-DQCkeZXu.js";import"./useLocalizedStringFormatter-CNTHe_n6.js";import"./Button-lJ2CGbxt.js";import"./Label-Zek0cQNR.js";import"./useLabel-BKLzxkTR.js";import"./useLabels-D61_ZlAV.js";import"./number-YjzVCZ5M.js";import"./useButton-BvDLj8oC.js";import"./Menu-BE7vb3R_.js";import"./Autocomplete-C_htAJtr.js";import"./getItemCount-Cz9MCKqo.js";import"./Input-BQrTLKPj.js";import"./ListBox-CEeIUydP.js";import"./Text-gNAEQAy_.js";import"./useListState-CoMNNvPQ.js";import"./Dialog-Ddg6xAXH.js";import"./Heading-Cd_XP2oj.js";import"./useOverlayTriggerState-9MfyzaMp.js";import"./VisuallyHidden-bnSaxykT.js";import"./animation-CfYGLk_Q.js";import"./SearchField-C-9_xXdO.js";import"./FieldError-BWSEqUjJ.js";import"./useFormValidation-5SPC4rhD.js";import"./useTextField-BzN2GkCH.js";import"./useField-RzY76_L5.js";import"./useFormReset-CLOf4j1R.js";import"./Virtualizer-ipgBCeUR.js";import"./useFilter-Cj_JbaCN.js";import"./getNodeText-BvqNLFC8.js";import"./Link-BNlANddI.js";import"./useResolvedHref-CWLs1pfc.js";import"./Tooltip-7f6CFq-V.js";import"./VisuallyHidden-FXX6aJuX.js";import"./Tabs-dMGqAcyR.js";import"./useHasTabbableChild-CzRdgFKW.js";import"./BUIRoutingProvider-Cv_U09wD.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
