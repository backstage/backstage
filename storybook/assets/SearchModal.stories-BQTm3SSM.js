import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-Dc6SVWG5.js";import{r as x}from"./plugin-DycAObjD.js";import{S as l,u as c,a as S}from"./useSearchModal-CI9ilP1o.js";import{s as M,M as C}from"./api-BxqHLxfN.js";import{S as f}from"./SearchContext-DqrUnkbo.js";import{B as m}from"./Button-CRU2KsP0.js";import{D as j,a as y,b as B}from"./DialogTitle-Blj5CnhU.js";import{B as D}from"./Box-DORcO5nL.js";import{S as n}from"./Grid-BSXyf9SS.js";import{S as I}from"./SearchType-CFp5W8Gs.js";import{L as G}from"./List-CqEwDLab.js";import{H as R}from"./DefaultResultListItem-D1j8gFUH.js";import{w as k}from"./appWrappers-BS_aK2if.js";import{SearchBar as v}from"./SearchBar-C3VaoGyr.js";import{S as T}from"./SearchResult-CPwqlZnJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BMfFXY5k.js";import"./Plugin-Bqo592_1.js";import"./componentData-B8Jq35jm.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./useRouteRef-ntEBWiMC.js";import"./index-8XuG-gel.js";import"./ArrowForward-CnwzCGwZ.js";import"./translation-CpVNt5-q.js";import"./Page-KCNtzKaC.js";import"./useMediaQuery-CmuQ3QFH.js";import"./Divider-B6Rq6sfT.js";import"./ArrowBackIos-D3D4GD-m.js";import"./ArrowForwardIos-G3rrLmLM.js";import"./translation-DI11G8aL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BGeZ5faP.js";import"./useMountedState-1x78q3TT.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./Backdrop-DWd11VkA.js";import"./styled-Dq5lPzbL.js";import"./ExpandMore-DbnKJ-3Y.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./ListItem-BhueXXFi.js";import"./ListContext-CQwj8Qg7.js";import"./ListItemIcon-DJxySM4s.js";import"./ListItemText-BD21enaM.js";import"./Tabs-BuEBAYpB.js";import"./KeyboardArrowRight-DEl3sBJ0.js";import"./FormLabel-BC623y4W.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C8sguxDP.js";import"./InputLabel-BJhsb98G.js";import"./Select-dHX4Oq4i.js";import"./Popover-iM_ezzPB.js";import"./MenuItem-CSGcDRRh.js";import"./Checkbox-DeCUp3AD.js";import"./SwitchBase-C5-KVES4.js";import"./Chip-JHBJeI6G.js";import"./Link-CiS0SEiJ.js";import"./useObservable-BhSXlvnh.js";import"./useIsomorphicLayoutEffect-4X9BfDi_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-S3cm4NhX.js";import"./useDebounce-CYvO8Dsk.js";import"./InputAdornment-BS02K7_t.js";import"./TextField-DT0soD53.js";import"./useElementFilter-IyzfPr5g.js";import"./EmptyState-BcQFN6fL.js";import"./Progress-DsM4CsWH.js";import"./LinearProgress-BL8aFNkV.js";import"./ResponseErrorPanel-DB3no35-.js";import"./ErrorPanel-D-ezxJ4v.js";import"./WarningPanel-C3dDiuJG.js";import"./MarkdownContent-B1WuysOW.js";import"./CodeSnippet-BullD9eL.js";import"./CopyTextButton-B-mnnb3d.js";import"./useCopyToClipboard-CBsscp3Q.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
