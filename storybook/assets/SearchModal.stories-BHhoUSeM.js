import{j as t,m as u,I as p,b as g,T as h}from"./iframe-BooBp-Po.js";import{r as x}from"./plugin-BF6HMdmX.js";import{S as l,u as c,a as S}from"./useSearchModal-DXG0lmzq.js";import{B as m}from"./Button-Cv3OLp_n.js";import{a as M,b as C,c as f}from"./DialogTitle-CrfKXT0M.js";import{B as j}from"./Box-obs2E8MU.js";import{S as n}from"./Grid-DyVJyHQ5.js";import{S as y}from"./SearchType-D9er7FJB.js";import{L as I}from"./List-Cb7k0m_f.js";import{H as B}from"./DefaultResultListItem-CO8Gk0Xr.js";import{s as D,M as G}from"./api-Dw2e48Gs.js";import{S as R}from"./SearchContext-DDJFifE2.js";import{w as T}from"./appWrappers-CTUrCtOx.js";import{SearchBar as k}from"./SearchBar-lWh7t56b.js";import{a as v}from"./SearchResult-KDrywHR5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-yX-uEimB.js";import"./Plugin-B6z4Q4HB.js";import"./componentData-UC---0ba.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./useRouteRef-C16BXt-W.js";import"./index-uVUaDJuf.js";import"./ArrowForward-B0hk3RK2.js";import"./translation-CmbUEeG8.js";import"./Page-BzlNlGQo.js";import"./useMediaQuery-DxyVDiKd.js";import"./Divider-k2YJ45XN.js";import"./ArrowBackIos-Ce3912hR.js";import"./ArrowForwardIos-CyHUzfq-.js";import"./translation-CiY1oOzv.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./Backdrop-B9Tcq6ce.js";import"./styled-DJvGKcz3.js";import"./ExpandMore-Bspz5IQW.js";import"./useAsync-BkydaeDo.js";import"./useMountedState-BZIVYzWq.js";import"./AccordionDetails-DxggSv3D.js";import"./index-B9sM2jn7.js";import"./Collapse-CmSq19t6.js";import"./ListItem-CUDBczQT.js";import"./ListContext-5jNT-Bcm.js";import"./ListItemIcon-DSUOg4pW.js";import"./ListItemText-Bjf3smxb.js";import"./Tabs-DzVe-yyS.js";import"./KeyboardArrowRight-DRJs5wM6.js";import"./FormLabel-D8h2TUSm.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C2yL_7QZ.js";import"./InputLabel-BQxf5fw8.js";import"./Select-DhfCFh64.js";import"./Popover-CRZn-eII.js";import"./MenuItem-CE19aExV.js";import"./Checkbox-ChL8T88p.js";import"./SwitchBase-ChxTQuc4.js";import"./Chip-x7s0ZWyH.js";import"./Link-6ZJtYR0w.js";import"./lodash-DLuUt6m8.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BisxNl-0.js";import"./useDebounce-BKGpyqva.js";import"./InputAdornment-fTBRkCWl.js";import"./TextField-BV6xhwxI.js";import"./useElementFilter-CLfhEfrq.js";import"./EmptyState-oZxf7l0v.js";import"./Progress-ZYZqfLBt.js";import"./LinearProgress-B9g18yY7.js";import"./ResponseErrorPanel-DFMgEimR.js";import"./ErrorPanel-J8VMJBUn.js";import"./WarningPanel-Df9ZONi2.js";import"./MarkdownContent-BDjlG_JM.js";import"./CodeSnippet-L6pub6pc.js";import"./CopyTextButton-CtUqznh5.js";import"./useCopyToClipboard-B64G66d9.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
