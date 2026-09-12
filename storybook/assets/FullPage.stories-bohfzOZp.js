import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-Di5Wv8w_.js";import{P as l}from"./PluginHeader-C4K9PwtX.js";import{C as p}from"./Container-MBl1gadW.js";import{T as t}from"./Text-Cq2wVIG2.js";import{B as j}from"./BUIProvider-DydDATQP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_LMY1zh.js";import"./utils-B6tfyu-3.js";import"./useObjectRef-VfTF6kKY.js";import"./useCollection-DqjpBTfn.js";import"./useFocusRing-BPuyfxah.js";import"./openLink-BAk59qtu.js";import"./Hidden-CQX9C-br.js";import"./keyboard-NoPc3y_q.js";import"./FocusScope-B2HES5fa.js";import"./useEvent-CuOYtYB8.js";import"./I18nProvider-Dxi4hkuu.js";import"./usePress-C2lMTGjY.js";import"./textSelection-D0hNc5Yy.js";import"./useControlledState-BMloOWSe.js";import"./Link-TksFGaQo.js";import"./useLink-CRPT3201.js";import"./useHover-BfN1GoIh.js";import"./useLocalizedStringFormatter-BlsbGP9l.js";import"./Button-CUbHo8av.js";import"./Label-C3XyxUp7.js";import"./useLabel-CGVvVLBl.js";import"./useLabels-B0juHqyU.js";import"./number-CGr55I-p.js";import"./useButton-BchjX23Y.js";import"./Menu-BwnIQha6.js";import"./Autocomplete-BSnZkzEE.js";import"./getItemCount-CBjAjuNY.js";import"./Input-sOjH10cq.js";import"./ListBox-hN0g2wiL.js";import"./Text-B1IXOSEc.js";import"./useListState-jz-je0jZ.js";import"./Dialog-DQiaRJTa.js";import"./Heading-DUbgD_Jd.js";import"./useOverlayTriggerState-BbiImD-e.js";import"./VisuallyHidden-DMNBewmj.js";import"./animation-DXfiyiY4.js";import"./SearchField-CuVOiLwK.js";import"./FieldError-Bjv2kxdK.js";import"./useFormValidation-DlvzbiO5.js";import"./useTextField-D7txPfzv.js";import"./useField-Ct6F0SgU.js";import"./useFormReset-CYxgn0S-.js";import"./Virtualizer-CzuBV1yb.js";import"./useFilter-Cqz1MX-e.js";import"./getNodeText-50b2UyOa.js";import"./Link-C4pz7dsS.js";import"./useResolvedHref-CvA6lHFs.js";import"./Tooltip-kTdyksyc.js";import"./VisuallyHidden-sNBIn0GO.js";import"./Tabs-B3RdkMOf.js";import"./useHasTabbableChild-BoCdQsYD.js";import"./BUIRoutingProvider-B9l2I63u.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
