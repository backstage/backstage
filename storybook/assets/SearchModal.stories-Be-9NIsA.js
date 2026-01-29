import{j as t,m as u,I as p,b as g,T as h}from"./iframe-BOS9XsSt.js";import{r as x}from"./plugin-DSJnjIU4.js";import{S as l,u as c,a as S}from"./useSearchModal-rzc33ZGK.js";import{B as m}from"./Button-D34xgd1Q.js";import{a as M,b as C,c as f}from"./DialogTitle-DX7hGYAC.js";import{B as j}from"./Box-BWfLAxjo.js";import{S as n}from"./Grid-DpJzwvsy.js";import{S as y}from"./SearchType-DgzgFuIe.js";import{L as I}from"./List-BHDOi6uW.js";import{H as B}from"./DefaultResultListItem-Bcj2qU1F.js";import{s as D,M as G}from"./api-D2Yypy4C.js";import{S as R}from"./SearchContext-CKylexrk.js";import{w as T}from"./appWrappers-Bmoaw7n3.js";import{SearchBar as k}from"./SearchBar-Tyt9IylJ.js";import{a as v}from"./SearchResult-BHp8oFtN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CcT_T83P.js";import"./Plugin-BLgAY6cH.js";import"./componentData-5CzPqeYQ.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./useRouteRef-D6pX7G_I.js";import"./index-BYPtPQ_E.js";import"./ArrowForward-DrsDRv_i.js";import"./translation-BsgFn9c_.js";import"./Page-DmGrFsV3.js";import"./useMediaQuery-BNvouAY3.js";import"./Divider-CxQHAU7C.js";import"./ArrowBackIos-CKHEHlVD.js";import"./ArrowForwardIos-Ci9VWi70.js";import"./translation-NngWztnI.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./Backdrop-CpYmoctA.js";import"./styled-dnrl8B5-.js";import"./ExpandMore-DPjiSkKA.js";import"./useAsync-DzexZZOZ.js";import"./useMountedState-DaLgI8Ua.js";import"./AccordionDetails-CY60n5OB.js";import"./index-B9sM2jn7.js";import"./Collapse-CD_ND2rt.js";import"./ListItem-D4jOCDNX.js";import"./ListContext-a1j27SdY.js";import"./ListItemIcon-hu1kjzm-.js";import"./ListItemText-BRz_C0D5.js";import"./Tabs-uwy0THFA.js";import"./KeyboardArrowRight-BW3YMm8-.js";import"./FormLabel-BymGJfAb.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DTI40LvL.js";import"./InputLabel--kTvBMSr.js";import"./Select-Bs2zu9h_.js";import"./Popover-BY21PHC9.js";import"./MenuItem-Dj-IQX4x.js";import"./Checkbox-C9UxbVdx.js";import"./SwitchBase-Dw2VgZAc.js";import"./Chip-_FTDVJfI.js";import"./Link-B09CKdbR.js";import"./lodash-Czox7iJy.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BGhxqWiH.js";import"./useDebounce-ZbxThQTu.js";import"./InputAdornment-vHkKUGjY.js";import"./TextField-DNnoNFHw.js";import"./useElementFilter-Bvvntj7Y.js";import"./EmptyState-VsUqFdFs.js";import"./Progress-DaWEFwns.js";import"./LinearProgress-j0on-w1A.js";import"./ResponseErrorPanel-DEAQLk2i.js";import"./ErrorPanel-DvbxkBY0.js";import"./WarningPanel-DBRwILC2.js";import"./MarkdownContent-BPIFlL-y.js";import"./CodeSnippet-CVmjwtmC.js";import"./CopyTextButton-Bp4E28TJ.js";import"./useCopyToClipboard-hUj9jZ5o.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
