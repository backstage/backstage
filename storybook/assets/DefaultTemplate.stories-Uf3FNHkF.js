import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C8yOC2Gz.js";import{s as g,H as u}from"./plugin-CqVHvhmx.js";import{c as h}from"./api-DOZG5ASV.js";import{c as f}from"./catalogApiMock-B58o2YmA.js";import{s as x}from"./api-DzvCKpP9.js";import{S as y}from"./SearchContext-BBlgcE06.js";import{P as S}from"./Page-D_9gv9RE.js";import{S as r}from"./Grid-CFxNiZTj.js";import{b as k,a as j,c as C}from"./plugin-C5Nls2ei.js";import{T as P}from"./TemplateBackstageLogo-BG4ZKQWJ.js";import{T}from"./TemplateBackstageLogoIcon-D2K--lAv.js";import{e as I}from"./routes-CiSCKseB.js";import{w as v}from"./appWrappers-BwqhmqR7.js";import{s as G}from"./StarredEntitiesApi-okwhi8r8.js";import{M as A}from"./MockStarredEntitiesApi-73icKMgX.js";import{I as B}from"./InfoCard-NdZuYaRN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-kU3y7djL.js";import"./Plugin-BKrfKbSW.js";import"./componentData-BzMhRHzP.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./useRouteRef-Csph2kF6.js";import"./index-CL1m9NR9.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./DialogTitle-BkYEluNi.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./Backdrop-CgVSzXAJ.js";import"./Button-BKAaE2BP.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BTwSHN8c.js";import"./ErrorBoundary-BZIgoJeC.js";import"./ErrorPanel-C1UVhDOE.js";import"./WarningPanel-k1eYB_NT.js";import"./ExpandMore-DevN-S2O.js";import"./AccordionDetails-ClHZ_AqU.js";import"./index-B9sM2jn7.js";import"./Collapse-BMBJHt31.js";import"./MarkdownContent-C9TrxeVt.js";import"./CodeSnippet-CcjaZ8oG.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./CopyTextButton-BJf8FGQ0.js";import"./useCopyToClipboard-Cdth3J8w.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./ListItem-BMFOx_2Q.js";import"./ListItemText-CyJt0pMj.js";import"./LinkButton-B4FRoGfy.js";import"./Link-CUs49TGY.js";import"./CardHeader-CK7GWSaa.js";import"./Divider-9e41O7nq.js";import"./CardActions-DjE-ZFS5.js";import"./BottomLink-hnT-aCrJ.js";import"./ArrowForward-CyzdqpLN.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
