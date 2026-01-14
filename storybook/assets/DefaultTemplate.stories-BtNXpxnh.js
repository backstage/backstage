import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-OUC1hy1H.js";import{s as g,H as u}from"./plugin-wNQH_TfH.js";import{c as h}from"./api-wACixSCz.js";import{c as f}from"./catalogApiMock-CFbg8dy1.js";import{s as x}from"./api-C0Hy5KZl.js";import{S as y}from"./SearchContext-e1r8ubOv.js";import{P as S}from"./Page-CHxZus2N.js";import{S as r}from"./Grid-DL-Pv4jh.js";import{b as k,a as j,c as C}from"./plugin-Ba_XObH0.js";import{T as P}from"./TemplateBackstageLogo-AxRh1HHp.js";import{T}from"./TemplateBackstageLogoIcon-CAtnkGnb.js";import{e as I}from"./routes-4LgcQaDV.js";import{w as v}from"./appWrappers-DdOwToTM.js";import{s as G}from"./StarredEntitiesApi-DMaDSZGX.js";import{M as A}from"./MockStarredEntitiesApi-CcUij30j.js";import{I as B}from"./InfoCard-CwMIYekH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBnHHQlp.js";import"./Plugin-DZn2Fxqk.js";import"./componentData-vJLnAM-9.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./useRouteRef-CAXRaq-D.js";import"./index-_R9_qqkB.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-4gF4WzZl.js";import"./useMountedState-BrWxqueh.js";import"./DialogTitle-CzK5jlaa.js";import"./Modal-B-jUxT4P.js";import"./Portal-DWQSZWuh.js";import"./Backdrop-D5NJdiNK.js";import"./Button-NJYqsc8m.js";import"./useObservable-BKXVW6Yy.js";import"./useIsomorphicLayoutEffect-BzuPE6E0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Cy9Tlq5V.js";import"./ErrorBoundary-ajCvZdhL.js";import"./ErrorPanel-D45LPvzG.js";import"./WarningPanel-4XJbGV6W.js";import"./ExpandMore-YNQPypsM.js";import"./AccordionDetails-BV-iIFxu.js";import"./index-B9sM2jn7.js";import"./Collapse-WWepLYBs.js";import"./MarkdownContent-DHn9pYVo.js";import"./CodeSnippet-DchPM48d.js";import"./Box-BmoTrTFH.js";import"./styled-A6cHt6de.js";import"./CopyTextButton-DRNDJ6Lk.js";import"./useCopyToClipboard-B_WaDLJZ.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./ListItem-CyBq-NVx.js";import"./ListItemText-BN19jovg.js";import"./LinkButton-KIWM0vJK.js";import"./Link-CyOWt6Zg.js";import"./CardHeader-GsaXemtv.js";import"./Divider-CEY86Jg2.js";import"./CardActions-ZHQriakr.js";import"./BottomLink-uShqIaMy.js";import"./ArrowForward-CNrami9f.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
