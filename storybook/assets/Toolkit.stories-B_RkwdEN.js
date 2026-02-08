import{j as o}from"./iframe-Cih9KYts.js";import{c as e}from"./plugin-3Q6LhQe7.js";import{S as l}from"./Grid-CLRvRbDN.js";import{C as m}from"./ComponentAccordion-CEsp5Kdd.js";import{w as a}from"./appWrappers-C7AQtpTy.js";import{T as i}from"./TemplateBackstageLogoIcon-JUYcJeEX.js";import{I as s}from"./InfoCard-BJ74Wy1V.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C_qaKzy-.js";import"./componentData-DlgYE3l_.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./useRouteRef-DDi4DkR7.js";import"./index-Bp0jFuCJ.js";import"./DialogTitle-CuYpVqTb.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./Backdrop-DyvTB40d.js";import"./Button-CKd96K2t.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./ExpandMore-Dc1qa72P.js";import"./AccordionDetails-CzBbo4eK.js";import"./index-B9sM2jn7.js";import"./Collapse-B12c-Txj.js";import"./useAsync-DPHt3xdh.js";import"./useMountedState-BYMagqon.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BSBI4Wy_.js";import"./ErrorBoundary-k6DARfl7.js";import"./ErrorPanel-DT8LzRfG.js";import"./WarningPanel-Cevqk5r0.js";import"./MarkdownContent-DcL7o88V.js";import"./CodeSnippet-vQgCgAWU.js";import"./Box-5LOyitj9.js";import"./styled-VBtFtbNj.js";import"./CopyTextButton-CcbF4huw.js";import"./useCopyToClipboard-7I7t0jup.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./ListItem-D5wUjexN.js";import"./ListItemText-jFKdxWsL.js";import"./LinkButton-CWYcR8SV.js";import"./Link-Ds2c62Jm.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CcUDO6MN.js";import"./Divider-BNkMSFIU.js";import"./CardActions-BWT2Xrl1.js";import"./BottomLink-o8fjmmLZ.js";import"./ArrowForward-Br-ribbp.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
