import{j as t,m as u,I as p,b as g,T as h}from"./iframe-DEXNC9RX.js";import{r as x}from"./plugin-Ba6MFlQU.js";import{S as l,u as c,a as S}from"./useSearchModal-CYJK3oQw.js";import{B as m}from"./Button-F3mebnqD.js";import{a as M,b as C,c as f}from"./DialogTitle-Cdw2QC1n.js";import{B as j}from"./Box-BngrI2dT.js";import{S as n}from"./Grid-DwntcsAr.js";import{S as y}from"./SearchType-BzMWXImm.js";import{L as I}from"./List-861P7w9f.js";import{H as B}from"./DefaultResultListItem-DkUBzZxM.js";import{s as D,M as G}from"./api-CHBY8DA5.js";import{S as R}from"./SearchContext-CXFPciIw.js";import{w as T}from"./appWrappers-ZgtTfHmd.js";import{SearchBar as k}from"./SearchBar-Dp2tfnKN.js";import{a as v}from"./SearchResult-XvfvlJS_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dt0Qv5kz.js";import"./Plugin-C9BoD7po.js";import"./componentData-CWUzWtHA.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./useRouteRef-ZxZLNpb-.js";import"./index-BlCxWptt.js";import"./ArrowForward-epoaBmEz.js";import"./translation-BrLSmZVA.js";import"./Page-CAlfsOJg.js";import"./useMediaQuery-MA-Sdype.js";import"./Divider-DNnZbvf9.js";import"./ArrowBackIos-_OhjeXiV.js";import"./ArrowForwardIos-mtMi8BvP.js";import"./translation-BqsLwdAz.js";import"./Modal-qxnLeQlM.js";import"./Portal-O6zOHTQ9.js";import"./Backdrop-DWlQwWtV.js";import"./styled-B4iJQM5t.js";import"./ExpandMore-Df24YjII.js";import"./useAsync-BAn5CjI7.js";import"./useMountedState-DIp_Aeij.js";import"./AccordionDetails-K4eNqGeL.js";import"./index-B9sM2jn7.js";import"./Collapse-DklbiL-j.js";import"./ListItem-BsFeXcoa.js";import"./ListContext-CuQ6sOnh.js";import"./ListItemIcon-Dp4eEMxb.js";import"./ListItemText-SZBW9x2i.js";import"./Tabs-lO72gvnD.js";import"./KeyboardArrowRight-DAsAE2yr.js";import"./FormLabel-Bsn6tYTR.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-20wdBt-x.js";import"./InputLabel-C-60XYv7.js";import"./Select-BneXbUnN.js";import"./Popover-Deo6ztQs.js";import"./MenuItem-5cijl-Ac.js";import"./Checkbox-jiWQCXd3.js";import"./SwitchBase-jHklRqhg.js";import"./Chip-BlPHtrVT.js";import"./Link-7jnzHmir.js";import"./lodash-Czox7iJy.js";import"./useObservable-pijbHhQ1.js";import"./useIsomorphicLayoutEffect-RgkXVcsu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D4O4qWyt.js";import"./useDebounce-_F9YF4GL.js";import"./InputAdornment-CVHL31Lb.js";import"./TextField-yZdrxO-c.js";import"./useElementFilter-CX7yGh-5.js";import"./EmptyState-UO4_hmIC.js";import"./Progress-pkY770fm.js";import"./LinearProgress-B1mWueke.js";import"./ResponseErrorPanel-D2M3oc3Z.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./MarkdownContent-yMYvzVpl.js";import"./CodeSnippet-D4GvPAYc.js";import"./CopyTextButton-DdSDl_l7.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
