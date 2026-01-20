import{j as t,m as u,I as p,b as g,T as h}from"./iframe-BOihsBca.js";import{r as x}from"./plugin-DVI0L5DQ.js";import{S as l,u as c,a as S}from"./useSearchModal-CVeDl9fO.js";import{B as m}from"./Button-GN2E3NYf.js";import{a as M,b as C,c as f}from"./DialogTitle-CjKWEdsz.js";import{B as j}from"./Box-CI5GVXvc.js";import{S as n}from"./Grid-1tirjwRV.js";import{S as y}from"./SearchType-i4108pC3.js";import{L as I}from"./List-CJIQS_VF.js";import{H as B}from"./DefaultResultListItem-B28xyvzZ.js";import{s as D,M as G}from"./api-B8E2_pqy.js";import{S as R}from"./SearchContext-Bmje9Es4.js";import{w as T}from"./appWrappers-DK15oPID.js";import{SearchBar as k}from"./SearchBar-5oA_tQAo.js";import{a as v}from"./SearchResult-CAm0-tbV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cu1cAzrK.js";import"./Plugin-BAjUdbN7.js";import"./componentData-TxEje_0q.js";import"./useAnalytics-DhOW7dTn.js";import"./useApp-BZBzLwEw.js";import"./useRouteRef-C2F4nlr5.js";import"./index-D4IyxNBc.js";import"./ArrowForward-DCIpWazW.js";import"./translation-D1j9PASX.js";import"./Page-BdWmsiXx.js";import"./useMediaQuery-CiU2CotE.js";import"./Divider-YwFpIHuT.js";import"./ArrowBackIos-HzN0t2Zg.js";import"./ArrowForwardIos-BHD5z_lj.js";import"./translation-C1CJCY-A.js";import"./Modal-jgY3Cn8t.js";import"./Portal-B8qEj_11.js";import"./Backdrop-Cv_Xkr3N.js";import"./styled-DdU_wQet.js";import"./ExpandMore-CS5zzKrc.js";import"./useAsync-DYwiSXoB.js";import"./useMountedState-BkgXJbA1.js";import"./AccordionDetails-22y-25Aw.js";import"./index-B9sM2jn7.js";import"./Collapse-I_wLTjeF.js";import"./ListItem-CxNFHnwj.js";import"./ListContext-CI2CUWLZ.js";import"./ListItemIcon-4JRPC9BS.js";import"./ListItemText-7EMyhNXk.js";import"./Tabs-a1SIjrsx.js";import"./KeyboardArrowRight-BjDGMulW.js";import"./FormLabel-CtoEs5yM.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-UT0bHK26.js";import"./InputLabel-DiVENNqm.js";import"./Select-BGx56pdw.js";import"./Popover-CPfwLRxB.js";import"./MenuItem-kMoeRuwU.js";import"./Checkbox-DCpZ8Q5P.js";import"./SwitchBase-BtaSuWPr.js";import"./Chip-DIL_DpaU.js";import"./Link-Cl4hSzOR.js";import"./lodash-DLuUt6m8.js";import"./useObservable-C0lzDriu.js";import"./useIsomorphicLayoutEffect-DIFcbIH0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BfpDq2pM.js";import"./useDebounce-BjOD_SZu.js";import"./InputAdornment-yA01MPNh.js";import"./TextField-_x_WHclT.js";import"./useElementFilter-CfQpq50X.js";import"./EmptyState-k7SMs49b.js";import"./Progress-BI6VaihQ.js";import"./LinearProgress-hovusI2Q.js";import"./ResponseErrorPanel-DAyQpGg-.js";import"./ErrorPanel-NVtD5Fmz.js";import"./WarningPanel-CphllhCv.js";import"./MarkdownContent-UpORQ4pi.js";import"./CodeSnippet-KsTffiAQ.js";import"./CopyTextButton-D9S96eUG.js";import"./useCopyToClipboard-VRQ5LG6h.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
